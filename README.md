MarkdownEditor.js
=================

A free cross-platform desktop editor for writing, publishing and sharing markdown documents.

Current Version: 0.2.1 Preview

Downloads:

- [Windows](https://sourceforge.net/projects/markdowneditor-js/files/0.2.1/MarkdownEditor-win.zip/download)
- [MacOS](https://sourceforge.net/projects/markdowneditor-js/files/0.2.1/MarkdownEditor-mac.zip/download)
- [Linux32](https://sourceforge.net/projects/markdowneditor-js/files/0.2.1/MarkdownEditor-linux32.zip/download)
- [Linux64](https://sourceforge.net/projects/markdowneditor-js/files/0.2.1/MarkdownEditor-linux64.zip/download)

![screenshot](doc/screenshot-mac.png)

![screenshot](doc/screenshot-win.png)

![screenshot](doc/screenshot-ubuntu.png)

Features
-----------------
An editor for writing and previewing local markdown file. Supports embedding local images.

There is an option to make auto numbering for headings, likes what Microsoft Word did.

You could share the markdown files to others in same network domain with you.

When a file is finished, you can publish it to HTML, PDF or image. The HTML is a single file, the CSS would be inserted to head tag and the IMAGEs would be embedded in base64 format!

Shortcuts
-----------------
The editor is based on [ACE](http://ace.c9.io/), the default keymaps are:
- copy: mod+c
- paste: mod+v
- cut: mod+x
- find: mod+f

The shortcuts for "file" menu are:
- new: mod+n
- open: mod+o
- save: mod+s
- save as: mod+shift+s

The theme of markdown
-----------------
Converted markdown documents would always be used for several cases:
1. The books, long story and long text;
2. The article, the guide, just like README, release notes, etc;
3. The email;

Each case needs different theme, for example, the headings in an article should be bigger than in an email because an article usually contains many headings and many sub headings. A bigger heading is easy to be recognized that is important in a long “text”, just like the default style in Microsoft word. And users have to write heading numbers by manual in markdown, which is very inconvenient. MarkdownEditor.js is also support auto number for headings, however, it’s not included in a theme currently, but an option in “settings->markdown”.

I don’t want to provide much colorful themes by default, for I endorsed “the less is more”. Actually, the Github Favorite Markdown style has become the standard theme. So I made some themes based on GFM style. That’s enough for emails, published PDFs and common use. If you want to customize, I will add an option to bind external CSS files.

The naming rule of themes is: [type]-[locals]
- type: book, article, email
- locals: en, zh
Examples: book-zh, email-en
The requisite of `locals` identify is, the best styles of different languages are also different: the font family, the font size and the indent of paragraphs. So I decided separate locals to different themes.

Here you may think about “the themes are nearly same”. That’s right. The differences are quite small so that I will make a template to generate these themes, just like what bootstrap did.


TO BE CONTINUED
-----------------
The themes

The settings

Roadmap
-----------------
### 0.2.x
- 0.2.1: Bug fixing version
    - Fix all the visible bugs;
    - Changes setting effects dynamicly;
    - Auto zip built files to zip;
- 0.2.2: Provides markdown themes:
    - There are some predefined themes;
    - Every new file should use the default theme (github style);
    - Each file could be assigned a theme which will be saved in localStorage (max 100 files);
- 0.2.3: Better scrolling sync support
- 0.2.4: Adds tooltips for menu commands
- 0.2.5: Support file watching and file cache (for auto saving and resuming)
- 0.2.6: File associations with OS

### 0.3.x
- 0.3.0: TOC markdown extension
- 0.3.1: Table support, not a markdown extension

### More
- Supports sharing files in domain network.
- Supports editing pictures.
- Use diff to highlight differences between current content and histories;

Author
-----------------
ConstantineXue @weibo.com

License
-----------------
MIT