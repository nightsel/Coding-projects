// Example JavaScript for a 4x4 sliding puzzle
        const puzzle = document.getElementById('puzzle');
        let tiles = Array.from({length: 15}, (_, i) => i + 1);
        tiles.push(null); // empty tile

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function render() {
            puzzle.innerHTML = '';
            tiles.forEach((num, idx) => {
                const div = document.createElement('div');
                div.className = 'tile';
                if (num === null) div.classList.add('empty');
                else div.textContent = num;
                div.addEventListener('click', () => move(idx));
                puzzle.appendChild(div);
            });
        }

        function move(idx) {
            const emptyIdx = tiles.indexOf(null);
            const row = Math.floor(idx / 4), col = idx % 4;
            const emptyRow = Math.floor(emptyIdx / 4), emptyCol = emptyIdx % 4;
            if ((row === emptyRow && Math.abs(col - emptyCol) === 1) ||
                (col === emptyCol && Math.abs(row - emptyRow) === 1)) {
                [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
                render();
            }
        }

        shuffle(tiles);
        render();
