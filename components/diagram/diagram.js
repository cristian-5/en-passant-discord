
import { Chess } from './chess.js';

import { decode } from 'https://deno.land/x/imagescript@1.2.9/mod.ts';

export async function diagram(fen) {
    
    if (!Chess().validate_fen(fen)) return null;
    
    const Board = await decode(Deno.readFileSync('./resources/board.png'));
    
    const Pieces = {
        'bp': await decode(Deno.readFileSync('./resources/alpha/bp.png')),
        'bn': await decode(Deno.readFileSync('./resources/alpha/bn.png')),
        'bb': await decode(Deno.readFileSync('./resources/alpha/bb.png')),
        'bq': await decode(Deno.readFileSync('./resources/alpha/bq.png')),
        'bk': await decode(Deno.readFileSync('./resources/alpha/bk.png')),
        'br': await decode(Deno.readFileSync('./resources/alpha/br.png')),
        'wp': await decode(Deno.readFileSync('./resources/alpha/wp.png')),
        'wn': await decode(Deno.readFileSync('./resources/alpha/wn.png')),
        'wb': await decode(Deno.readFileSync('./resources/alpha/wb.png')),
        'wq': await decode(Deno.readFileSync('./resources/alpha/wq.png')),
        'wk': await decode(Deno.readFileSync('./resources/alpha/wk.png')),
        'wr': await decode(Deno.readFileSync('./resources/alpha/wr.png')),
    };

    const board = Chess(fen).board();

    const canvas = Board.clone();

    // drawing pieces:
    /*for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] == null) continue;
            const piece = Pieces[board[i][j].color + board[i][j].type];
            canvas.composite(piece, j * 100, i * 100);
        }
    }*/

    return canvas.encode();

}