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

+ means this is a directory
- menas this is a file

```
+ guideline.proj
    - $head.json: Define the metadata, such as description, created date, and so on.

    'Articles'
    + java-style.md
        - head.json
        - body.md
        - screenshot1.jpg: For markdown reference
        - screenshot2.jpg
    
    'Codes'
    + java-eclipse-formatter.xml
        - head.json
        - body.xml
    
    'Images'
    + ui-design-button.jpg
        - head.json
        - body.jpg
    + ui-design-menu.jpg
        - head.json
        - body.jpg
```

## REST pages definition

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