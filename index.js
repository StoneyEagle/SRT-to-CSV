import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';


function convertToSeconds(hms) {
	if (!hms) {
		return 0;
	}
	const a = hms.split(':').map(n => parseInt(n, 10));
	if (a.length < 3) {
		a.unshift(0);
	}

	return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
};

function parseSubtitle(file, baseArray = ['date, index, start, end, text']) {
    const regex = /(?<index>[0-9]+)\n+(?<start>[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --> (?<end>[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})\n(?<text>.*?)\n\n/gms;

    const date = new Date(.../(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/.exec(file).slice(1))
    
    const str = readFileSync(file, 'utf8')
        .replace(/\r/g, '');

    let m;
    while ((m = regex.exec(str)) !== null) {
        
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        const realDate = new Date(date.getTime() + convertToSeconds(m?.groups?.start) * 1000);
    
        baseArray.push(`${date.toISOString()},${realDate.toISOString()},${m?.groups?.index},${m?.groups?.start.replace(',', '.')},${m?.groups?.end.replace(',', '.')},"${m?.groups?.text.replace(/\n/g, '\\n')}"`);
    }

    if (!existsSync(path.join(__dirname, 'output'))) {
        mkdirSync(path.join(__dirname, 'output'), { recursive: true });
    }
    
    writeFileSync(path.join(__dirname, 'output', date.toDateString() + '.csv'), baseArray.join('\n'));

    return baseArray;
}

const files = readdirSync(path.join(__dirname, 'input'))
    .map((file) => path.join(__dirname, 'input', file));

const total = ['date,realDate,index,start,end,text']
files.forEach((file) => {
    parseSubtitle(file, total);
});

writeFileSync(path.join(__dirname, 'output', 'total.csv'), total.join('\n'));
