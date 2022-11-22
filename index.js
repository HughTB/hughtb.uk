async function getFile(url) {
    const request = new Request(url);
    const response = await fetch(request);
    return response.text();
}

async function getJson(url) {
    const request = new Request(url);
    const response = await fetch(request);
    return response.json();
}

async function populateProjects() {
    const renderer = {
        heading(text, level) {
            if (level == 1) {
                return `
                    <h1>
                        ${text}
                    </h1>
                    <hr class="splitter">`;
            } else {
                return `
                    <h${level}>
                        ${text}
                    </h${level}>`;
            }
        }
    };
    
    marked.use({ renderer });

    var projects = (await getJson("/projects/projects.json")).projects;

    if (projects.length > 0) {
        projects.sort((a, b) => {
            if (a.updated > b.updated)
                return -1;
            if (b.updated > a.updated)
                return 1;
            return 0;
        })

        for (var i = 0; i < projects.length; i++) {
            const htmlContent = document.createElement("section");
            htmlContent.className = "content-box";
            htmlContent.innerHTML = marked.parse(await getFile(`projects/${projects[i].md}`));
            htmlContent.innerHTML += `<p>Last updated: ${projects[i].updated}</p>`;
            document.getElementById("projects").appendChild(htmlContent);
        }
    }
}

populateProjects();