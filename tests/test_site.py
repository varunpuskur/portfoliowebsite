"""Run from the project folder: python -m unittest discover -s tests -v"""
import unittest
from html.parser import HTMLParser
from app import create_app


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.references, self.urls = [], [], []
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1':
            self.headings += 1
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for name in ('aria-controls', 'aria-labelledby', 'aria-describedby'):
            self.references.extend(attrs.get(name, '').split())
        for name in ('src', 'href'):
            url = attrs.get(name, '')
            if url.startswith('/') and not url.startswith('//'):
                self.urls.append(url.split('#')[0])


class PortfolioTests(unittest.TestCase):
    def setUp(self):
        self.client = create_app().test_client()

    def test_pages_and_linked_assets(self):
        for route in ('/', '/work', '/work/encryptron', '/work/quickcart', '/art', '/resume'):
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 200)
                page = PageParser()
                page.feed(response.get_data(as_text=True))
                self.assertEqual(page.headings, 1)
                self.assertEqual(len(page.ids), len(set(page.ids)))
                self.assertTrue(set(page.references).issubset(page.ids))
                for url in set(page.urls):
                    with self.client.get(url) as asset:
                        self.assertEqual(asset.status_code, 200, url)

    def test_unknown_pages(self):
        for route in ('/missing', '/work/missing', '/work/app.py'):
            self.assertEqual(self.client.get(route).status_code, 404)

    def test_resume_download(self):
        response = self.client.get('/static/Varun_Puskur_Resume.pdf')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.startswith(b'%PDF'))
        response.close()


if __name__ == '__main__':
    unittest.main()
