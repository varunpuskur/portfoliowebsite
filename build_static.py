"""Render the Flask portfolio for the existing Amplify static hosting app."""
from pathlib import Path
import shutil
from app import app

ROOT = Path(__file__).resolve().parent
ROUTES = ('/', '/work', '/work/encryptron', '/work/quickcart', '/art', '/resume')


def build():
    output = ROOT / 'out'
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    with app.test_client() as client:
        for route in ROUTES:
            response = client.get(route)
            if response.status_code != 200:
                raise RuntimeError(f'Cannot export {route}: {response.status_code}')
            page = output / route.lstrip('/') / 'index.html'
            page.parent.mkdir(parents=True, exist_ok=True)
            page.write_bytes(response.data)
        response = client.get('/missing')
        if response.status_code != 404:
            raise RuntimeError('Missing-page handler did not return 404')
        (output / '404.html').write_bytes(response.data)
    shutil.copytree(ROOT / 'static', output / 'static')
    for filename in ('Varun_Puskur_Resume.pdf', 'favicon.svg'):
        shutil.copy2(ROOT / 'static' / filename, output / filename)
    print(f'Exported {len(ROUTES)} pages and static assets to {output}')


if __name__ == '__main__':
    build()
