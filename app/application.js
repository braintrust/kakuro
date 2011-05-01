/**
 * returns a size x size table
 */
function initialize(size)
{
    var table = [], i, j;
    for (i=0; i < size; i++)
    {
        table[i] = [];
        for (j=0; j < size; j++)
        {
            table[i][j] = true;
        }
    }
    return table;
}

function findIsland(table)
{
    var i, j;
    var result = { x:0, y:0 };
    
    for (i = 1; i < table.length; i++)
    {
        for (j = 0; j < table[i].length; j++)
        {
            if (table[i][j] === 0)
            {
                result.x = i;
                result.y = j;
                return result;
            }
        }
    }
    return result;
}

function colorTable(table, posX, posY, color, counts)
{
    table[posX][posY] = color;
    counts[color-1] += 1;
    
    if (posY > 0 && !table[posX][posY-1]) colorTable(table, posX, posY-1, color, counts);
    if (posY < table.length-1 && !table[posX][posY+1]) colorTable(table, posX, posY+1, color, counts);
    if (posX > 0 && !table[posX-1][posY]) colorTable(table, posX-1, posY, color, counts);
    if (posX < table.length-1 && !table[posX+1][posY]) colorTable(table, posX+1, posY, color, counts);
}

function pruneSmallIslands(table, counts)
{
    var i,j;
    for (i = 0; i < table.length; i++)
    {
        for (j=0; j < table[i].length; j++)
        {
            var color = table[i][j];
            if (counts[color-1] < 3)
            {
                table[i][j] = -1;
            }
            else if (table[i][j] > 0)
            {
                table[i][j] = 0;
            }
        }
    }
    return table;
}

function colorIslands(table)
{
    var color = 0;
    var island = findIsland(table);
    var counts = [];
    while (island.x || island.y)
    {
        counts[color] = 0;
        colorTable(table, island.x, island.y, ++color, counts);
        island = findIsland(table);
    }
    return counts;
}

/**
 * initializes the game board given the density of blacks
 */
function makeGame(table, density)
{
    var i,j;
    for (i=0; i < table.length; i++)
    {
        for (j=0; j < table[i].length; j++)
        {
            table[i][j] = (0 !== i && 0 !== j && Math.random() > density) ? 0 : -1;
        }
    }
    var counts = colorIslands(table);
    pruneSmallIslands(table, counts);
    counts = colorIslands(table);
    return counts;
}

function write(output) { document.write(output); }
function render(table)
{
    var colors = ['yellow', 'green', 'blue', 'red', 'orange', 'purple', 'turquoise'];
    var i,j;
    write('<table><tbody>');
    for (i=0; i < table.length; i++)
    {
        write('<tr>');
        for (j=0; j < table[i].length; j++)
        {
            write('<td class="');
            write(table[i][j] < 0 ? 'black' : colors[table[i][j]-1]);
            write('"></td>');
        }
        write('</tr>');
    }
    write('</tbody></table>');
}

(function() {
    var gameTable, counts, i;
    var perfectTables = 0;
    for (i=0; i < 100; i++)
    {
        gameTable = initialize(16);
        counts = makeGame(gameTable, 0.3);

        perfectTables += 1 === counts.length ? 1 : 0;
    }
    alert('we made: ' + perfectTables + ' perfect Tables');
    render(gameTable);
})();