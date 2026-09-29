"""Flask routes for the portfolio. Run: python app.py"""
from datetime import datetime, timezone
from flask import Flask, abort, render_template
from content import ARTWORKS

PAGES = {
    'index': ('Varun Puskur — Software, Design & Art', 'Computer science at Virginia Tech. Software projects, experience, and original drawings.', ''),
    'work': ('Work · Varun Puskur', 'Explore Encryptron and QuickCart case studies.', 'work'),
    'encryptron': ('Encryptron · Varun Puskur', 'A Python and Flask file-processing prototype with accounts and permissions.', 'work'),
    'quickcart': ('QuickCart · Varun Puskur', 'Research, wireframes, and iterations for a grocery-shopping app concept.', 'work'),
    'art': ('Drawings · Varun Puskur', 'Original graphite portraits, wildlife, cars, and digital studies.', 'art'),
    'resume': ('Résumé · Varun Puskur', 'Education, experience, and selected projects.', ''),
}


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False

    def page(name):
        title, description, active = PAGES[name]
        return render_template(f'{name}.html', title=title, description=description,
                               active_page=active, page_name=name, artworks=ARTWORKS,
                               current_year=datetime.now(timezone.utc).year)

    @app.get('/')
    def index():
        return page('index')

    @app.get('/work')
    def work():
        return page('work')

    @app.get('/work/<project>')
    def project(project):
        if project not in ('encryptron', 'quickcart'):
            abort(404)
        return page(project)

    @app.get('/art')
    def art():
        return page('art')

    @app.get('/resume')
    def resume():
        return page('resume')

    @app.get('/Varun_Puskur_Resume.pdf')
    def resume_file():
        return app.send_static_file('Varun_Puskur_Resume.pdf')

    @app.get('/favicon.svg')
    def favicon():
        return app.send_static_file('favicon.svg')

    @app.errorhandler(404)
    def not_found(error):
        return render_template('404.html', title='Page not found · Varun Puskur',
                               description='Return to the portfolio.', active_page='',
                               page_name='404', current_year=datetime.now(timezone.utc).year), 404

    @app.after_request
    def response_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response

    return app


app = create_app()

if __name__ == '__main__':
    # Local development only. See serve.py for production serving.
    app.run(host='127.0.0.1', port=5000)
