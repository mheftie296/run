#!/usr/bin/env python3

from flask import Flask, render_template, redirect, url_for, request, jsonify

app = Flask(__name__)

scoreslist = {}

with open('scores.txt', 'r') as scores:
    for line in scores:
        if '|' not in line:
            continue
        data = line.strip().split('|')
        scoreslist[int(data[1])] = data[0]

@app.route('/scores', methods=['GET', 'POST'])
def scores():
    if request.method == 'POST':
        name = request.json['name']
        score = request.json['score']
        with open('scores.txt', 'a') as file:
            file.write(f"{name}|{score}\n")
        scoreslist[int(score)] = name
        return "ok"
    sscores = {}
    for key in sorted(scoreslist.keys(), reverse=True):
        sscores[key] = scoreslist[key]
        if len(sscores) == 10:
            break
    print(sscores)
    return jsonify(sscores)

@app.route('/run')
def directory():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=15944, debug=True)