async function fetchAndLogAllText(url) {
    try {
        console.log('starting');
        const res = await fetch(`/fetchPage?url=${encodeURIComponent(url)}`);
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Collect ALL visible text (ignore script/style/noscript)
        let text = "";
        const walker = document.createTreeWalker(
            doc.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode && ["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentNode.nodeName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        while (walker.nextNode()) {
            text += walker.currentNode.nodeValue + " ";
        }

        console.log("Raw text length:", text.length);

        // --- Word frequency calculation ---

        const words = text
          .toLowerCase()
          .match(/\p{L}+/gu); // handles ä, ö, å, ü, é, etc.

        if (!words) {
            console.log("No words found!");
            return;
        }

        const freq = {};
        words.forEach(w => {
            freq[w] = (freq[w] || 0) + 1;
        });

        const sorted = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);

        console.log("Most common words:", sorted);

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = sorted.map(([w, c]) => `${w}: ${c}`).join("<br>");

    } catch (err) {
        console.error("Error fetching or parsing page:", err);
    }
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value;
    fetchAndLogAllText(url);
});
