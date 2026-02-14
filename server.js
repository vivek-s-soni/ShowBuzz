const http = require("http");
const db = require("./db/database");

const server = http.createServer((req, res) => {

    if (req.url === "/add" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const data = JSON.parse(body);

            db.run("INSERT INTO shows(name,rating) VALUES(?,?)",
                [data.name, data.rating],
                () => {
                    res.end("Show Added");
                }
            );
        });
    }

    else if (req.url === "/shows") {
        db.all("SELECT * FROM shows", (err, rows) => {
            res.end(JSON.stringify(rows));
        });
    }

});

server.listen(3000, () => console.log("Server running"));