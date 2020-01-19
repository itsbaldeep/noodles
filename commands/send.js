module.exports = {
    name: 'send',
    execute(message, args) {
        const https = require('https');
        const input = encodeURI(args.join(' '));

        const options = {
            host: 'api.pexels.com',
            path: `/v1/search?per_page=80&query=${input}`,
            headers: { 'Authorization': process.env.PEXELS_API }
        };

        const req = https.request(options, res => {
            let buffer = '';
            res.on('data', res => buffer += res);
            res.on('end', () => {
                const data = JSON.parse(buffer);
                const length = Math.min(data.per_page, data.total_results);
                const index = Math.floor(Math.random() * length);
                const photo = data.photos ? data.photos[index] : undefined;

                if (photo) 
                    message.channel.send(`:man_gesturing_ok: ${args.join(' ')} for you! ${photo.src.original}`);
                else
                    message.channel.send(':man_gesturing_no: No photos found relating to your search!');
            });
            res.on('error', console.log);
        });
        req.end();
    }
}
