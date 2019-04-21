/**
 * YAML based mindmap parsing, based on https://github.com/eemeli/yaml
 * @version 1.0.1
 * @author skitsanos
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

class MindmapParser
{
    constructor()
    {
        this.version = '1.0.1';
    }

    parseElement(datadoc, items)
    {
        for (const el of items['[]'])
        {
            let item = {};

            if (typeof el === 'object')
            {
                item = {name: el.name};

                if (Array.isArray(el['[]']))
                {
                    item.children = [];
                    this.parseElement(item, el);
                }
            }
            else
            {
                item = {name: el};
            }

            datadoc.children.push(item);
        }
    }

    parse(content)
    {
        try
        {
            const doc = YAML.parse(content, {prettyErrors: true});
            //console.log(JSON.stringify(doc, null, 3));

            let datadoc = {name: Object.keys(doc)[0], children: []};

            this.parseElement(datadoc, Object.values(doc)[0][0]);
            return [datadoc];
        } catch (e)
        {
            console.error(e.message);
        }
    }
}

const mind = new MindmapParser();

const content = fs.readFileSync(path.join(__dirname, 'test.yaml')).toString();
const data = mind.parse(content);
console.log(data);
