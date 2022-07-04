var express = require('express');
const fs = require('fs')
const nodeHtmlToImage = require('node-html-to-image')

const {registerFont, createCanvas, loadImage} = require('canvas')

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.post('/generate', async function (req, res, next) {
    async function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }


    const text_url = req.body.url;
    let text_title = req.body.title;
    let text_content = req.body.content;

    try {
        if (fs.existsSync(process.cwd() + `/public/images/${string_to_slug(text_title)}.png`)) {
            await res.sendFile(process.cwd() + `/public/images/${string_to_slug(text_title)}.png`);
        } else {
            //file exists


            if (text_title.length > 57) {
                text_title = text_title.substring(0, 57) + ' ...';
            }

            if (text_content.length > 156) {
                text_content = text_content.substring(0, 156) + ' ...';
            }


            let html = `
            <style>
        * {
          box-sizing: border-box;
        }
        html {
                  height: 121px;
          width: 646px;
        }
        body {
          font-family: 'Roboto', sans-serif;
          margin:0;
          height: 121px;
          width: 646px;
        }
        .snippet {
            padding-top: 12px;
            padding-bottom: 12px;
            padding-left: 24px;
            padding-right: 24px;
            width: 646px;
        }
        .snippet-url {
            color: #202124;
            font-size: 14px;
            padding-top: 1px;
            line-height: 1.3;
            font-style: normal;

        }
        .snippet-title {
            color: #1a0dab;
            font-family: arial, sans-serif;
            font-size: 20px;
            font-weight: normal;
            line-height: 1.3;
            text-align: left;
            text-decoration: none;
            text-decoration-color: #1a0dab;
            text-decoration-line: none;
            text-decoration-style: solid;
            white-space: nowrap;
            display: block;
            padding-top: 4px;
            margin-block-end: 3px;
            margin-bottom: 3px;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .snippet-content {
            color: #4d5156;
            font-family: arial, sans-serif;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.58;
            word-wrap: break-word;
            text-align: left;
            display: block;
        }
    </style>
            <div class="snippet">
                <div class="snippet-url">
                    <span>${text_url}</span>
                </div>
                <div class="snippet-title">
                    <span>${text_title}</span>
                </div>
                <div class="snippet-content">
                    <span>${text_content}</span>
                </div>
            </div>`;


            await nodeHtmlToImage({
                output: process.cwd() + `/public/images/${string_to_slug(text_title)}.png`,
                html: `<html><head>    <link rel='stylesheet' href='/stylesheets/style.css'/>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"></head><body>${html}</body></html>`
            })

            await res.sendFile(process.cwd() + `/public/images/${string_to_slug(text_title)}.png`);
        }
    } catch (err) {
        console.error(err)
    }
});

module.exports = router;
