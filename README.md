packled-papper.js
=================

A place for sharing articles easily

## Goals

- Small group update documents continuously.
  - Show the differents of each file and change histories.
- Using text/markdown to write.
  - I hate any non-plain format, includes database.
- Multi editing environment, both online and offline.
- Well organized, subjects, grouping, sorting and preview.
- Maybe there is a client!

## A file based structure sample

'+' means this is a directory
'-' menas this is a file

```
+ guideline
    - $metadata.json: Define the metadata, such as description, created date, and so on.

    'Articles'
    - java-style.md: Source file
    + java-style.md: History files, optional
        - metadata.json: Metadata file
        - 20130507123548.md
        - 20130507123548.json: diff information
    
    'Codes'
    - java-eclipse-formatter.xml
    
    'Images'
    - ui-design-button.jpg
    - ui-design-menu.jpg
```

# REST definiations

ref: http://raml.org/docs.html

## REST pages

```
/index: Show all projects and its files
/[project]: Reserved
/[project]/[file]
/[project]/[file]/raw
/[project]/[file]/download
/[project]/[file]/edit
/[project]/[file]/histories
/help
```

## REST APIs

```RAML
baseUri: /api
version: v1

/projects:
    /{project}:
        /text:
            /{document}
                get:
                    description:
                    queryParameters:
                    responses:
                post:
                put:
                delete:
```