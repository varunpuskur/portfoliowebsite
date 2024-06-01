from flask import Flask, render_template

app = Flask(__name__)

# Define routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portfolio')
def portfolio():
    # Example data for portfolio projects
    projects = [
        {'title': 'Project 1', 'description': 'Description of project 1'},
        {'title': 'Project 2', 'description': 'Description of project 2'}
        # Add more projects as needed
    ]
    return render_template('portfolio.html', projects=projects)

if __name__ == '__main__':
    app.run(debug=True)
