# Personal Portfolio — Varun Puskur

My personal website for software projects, design work, my résumé, and drawings.

**[Visit the portfolio](https://www.varunpuskur.com)**

## What it includes

- Software and design case studies for Encryptron and QuickCart.
- An original-art gallery driven by shared artwork data.
- A résumé page and PDF route.
- Page-specific titles and descriptions, a custom 404 page, and response headers.
- A Flask application and a separate static-site build script.

## Technology

Python, Flask, Jinja templates, HTML, CSS, and JavaScript.

## Run locally

```sh
git clone https://github.com/varunpuskur/portfoliowebsite.git
cd portfoliowebsite
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

On Windows, activate the environment with `.venv\Scripts\activate`.

Open http://127.0.0.1:5000. The server started by `app.py` is for local development.

## Project structure

| Path | Purpose |
| --- | --- |
| `app.py` | Flask application factory, routes, and response headers |
| `content.py` | Shared artwork content |
| `templates/` | Jinja page templates |
| `static/` | Styles, scripts, images, and other assets |
| `build_static.py` | Static-site build script |
| `serve.py` | Alternative serving entry point |
| `tests/` | Existing project tests |
| `amplify.yml` | AWS Amplify build configuration |

## Explore the implementation

Start with `create_app()` in `app.py`, then follow the page templates and static assets. `/work/encryptron` and `/work/quickcart` describe the projects; `/art` presents the drawings.

The setup instructions are based on the repository structure and entry point. They have not been executed as part of this documentation update.
