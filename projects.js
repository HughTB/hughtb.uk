async function getJson(url) {
    const request = new Request(url);

    const response = await fetch(request);

    return response.json();
}

async function populate() {
    var json = await getJson("https://hughtb.uk/projects.json");
    var main = document.getElementById("projects-div");

    if (json.projects.length >= 1) {
        document.getElementById("placeholder").remove();

        for (let i = json.projects.length - 1; i >= 0; i--) {
            var element = json.projects[i];
    
            var body = document.createElement("div");
            body.className = "grid-container";

            var div = document.createElement("div");

            var h3 = document.createElement("h3");
            h3.append(document.createTextNode(element.name));

            var p = document.createElement("p");
            var splitDesc = element.desc.split("\n");

            for (let j = 0; j < splitDesc.length; j++) {
                p.append(document.createTextNode(splitDesc[j]));
                if (splitDesc.length > 1 && j < splitDesc.length - 1) {
                    p.append(document.createElement("br"));
                }
            }

            p.append(document.createElement("br"));
            
            if (element.link != "n/a") {
                p.append(document.createElement("br"));
                p.append(document.createTextNode("Get the latest release "));

                var a = document.createElement("a");
                a.append(document.createTextNode("here"));
                a.href = element.link;
                a.target = "_blank";
                a.style = "text-decoration: underline;"
                p.append(a);

                p.append(document.createTextNode(" (Last updated: " + element.lastUpdated + ")"));
            }

            if (element.repo != "n/a") {
                p.append(document.createElement("br"));
                p.append(document.createTextNode("Get the source code "));
                var a2 = document.createElement("a");
                a2.append(document.createTextNode("here"));
                a2.href = element.repo;
                a2.target = "_blank";
                a2.style = "text-decoration: underline;";
                p.append(a2);
            }
    
            div.appendChild(h3);
            div.appendChild(p);
    
            body.appendChild(div);
    
            for (let j = 0; j < element.images.length; j++) {
                var img = document.createElement("img");
                img.src = element.images[j];
                img.className = "project-image";
                body.appendChild(img);
            }

            main.appendChild(body);
            
            if (i != 0) {
                var spacer = document.createElement("div");
                spacer.className = "spacer";
                main.appendChild(spacer);
            }
        }
    }
}

populate();