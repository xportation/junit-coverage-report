
# Pytest: JUnit Coverage Report

![licence](https://img.shields.io/github/license/xportation/junit-coverage-report) ![version](https://img.shields.io/github/package-json/v/xportation/junit-coverage-report)

Add a pull request comment with tests results and coverage report.  
Works with `junit` and `coverage` XML output from `pytest`.
```bash
python3 -m pytest --cov-report "xml:reports/coverage/coverage.xml" --junitxml="reports/unit/unit.xml"
```
## How to use
Add this action to your GitHub workflow as follows:
```yaml
- name: Test Reports
  uses: xportation/junit-coverage-report@main
  with:
    junit-path: ./reports/unit/unit.xml  
    coverage-path: ./reports/coverage/coverage.xml
```
You can also define `github-token` used for the Github comments API.
```yaml
- name: Custom Reports
  uses: xportation/junit-coverage-report@main
  with:
    github-token: {{ $secrets.your_secret }}   
    junit-path: ./reports/unit/unit.xml  
    coverage-path: ./reports/coverage/coverage.xml
```

## Default report:
### Collapsed
![Collapsed](https://user-images.githubusercontent.com/4412615/170509399-061fcaea-6aff-4449-8fec-58a5fb992b19.jpg)
### Expanded
![Expanded](https://user-images.githubusercontent.com/4412615/170509295-029e877d-a8ab-4016-a033-15a1208dcba2.jpg)

## Custom reports
You can define custom reports using [Handlebars](https://handlebarsjs.com) templates.  
Just add the `template-path` with the file url. 
```yaml
- name: Custom Reports
  uses: xportation/junit-coverage-report@main
  with:
    template-path: ./reports/custom_template.html   
    junit-path: ./reports/unit/unit.xml  
    coverage-path: ./reports/coverage/coverage.xml
```
### Data Schema
The data schema provided for the template rendering:
```txt
{
  coverage: {
    badge,
    total: {
      stmts,
      miss,
      cover
    },
    items: [
      {
        fileUrl, 
        filename, 
        stmts, 
        miss, 
        cover, 
        missing: [
          {
            range, 
            url
          }
        ]
      }
    ]
  }, 
  junit: {
    tests, 
    skipped, 
    failures, 
    errors, 
    time, 
    failuresItems: [
      {
        filename, 
        message
      }
    ]
  } 
}
```

### Default Template
The default template is below:
```html
<img alt="Coverage" src="{{coverage.badge}}" />
<br/>
<details>
    <summary>Coverage Report</summary>
    <table>
        <tr>
            <th>File</th>
            <th>Stmts</th>
            <th>Miss</th>
            <th>Cover</th>
            <th>Missing</th>
        </tr>
        <tbody>
            {{#coverage.items}}
            <tr>
                <td><a href="{{fileUrl}}">{{filename}}</a></td>
                <td>{{stmts}}</td>
                <td>{{miss}}</td>
                <td>{{cover}}</td>
                <td>
                {{#missing}}
                    <a href="{{url}}">{{range}}</a> 
                {{/missing}}
                </td>
            </tr>
            {{/coverage.items}}
            <tr>
                <td><b>TOTAL</b></td>
                <td><b>{{coverage.total.stmts}}</b></td>
                <td><b>{{coverage.total.miss}}</b></td>
                <td><b>{{coverage.total.cover}}</b></td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>
</details>
<br/> 
<table>
    <tbody>
        <tr>
            <td><strong>Tests</strong></td>
            <td><strong>Skipped</strong></td>
            <td><strong>Failures</strong></td>
            <td><strong>Errors</strong></td>
            <td><strong>Time</strong></td>
        </tr>
        <tr>
            <td>{{junit.tests}}</td>
            <td>{{junit.skipped}} 💤</td>
            <td>{{junit.failures}} ❌</td>
            <td>{{junit.errors}} 🔥</td>
            <td>{{junit.time}} ⏱</td>
        </tr>
    </tbody>
</table>
<br/>
{{#if junit.failuresItems}}
<details>
    <summary>Unit Failures</summary>
    <table>
        <tr>
            <th>Test</th>
            <th>Message</th>
        </tr>
        <tbody>
            {{#junit.failuresItems}}
            <tr>
                <td>{{filename}}</td>
                <td><code>{{{message}}}</code></td>
            </tr>
            {{/junit.failuresItems}}
        </tbody>
    </table>
</details>
{{/if}}
```

## Alternative GH Action
This project was strongly inspired by the [Pytest Coverage Comment](https://github.com/MishaKav/pytest-coverage-comment)  
It's a great alternative project. You should consider it 🖤.
