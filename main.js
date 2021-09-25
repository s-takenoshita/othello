'use strict';

{
  const WHITE = 1;
  const BLACK = -1;

  class Cell {
    constructor(board,r,c) {
      this.board = board;
      this.row = r;
      this.col = c;
      this.color = 0;       // 0:Empty 1:White 2:Black
      this.td = document.createElement('td');
      // this.td.textContent = this.row.toString() + '-' + this.col.toString();
      this.td.addEventListener('click', () => {
        if (this.color === 0) {
          board.check(this);
          if (board.countScore() === 64) {
            alert('Fnished!');
          }
        }
      })
    }
    initialize() {
      this.color = 0;
        this.td.classList.remove('white');
        this.td.classList.remove('black');
    }
    toCurrentColor() {
      this.color = currentPrayer;
      if (this.color === WHITE) {
        this.td.classList.remove('black');
        this.td.classList.add('white');  
      }
      if (this.color === BLACK) {
        this.td.classList.remove('white');
        this.td.classList.add('black');  
      }
    }
    toWhite() {
      this.td.classList.remove('black');
      this.td.classList.add('white');
      this.color = WHITE;
    }
    toBlack() {
      console.log('toBlack!');
      console.log('text => ' + this.td.textContent);
      this.td.classList.remove('white');
      this.td.classList.add('black');
      this.color = BLACK;
    }
    toInvert() {
      console.log('toInvert this.color => ' + this.color);
      if (this.color === WHITE) {
        this.color = BLACK;
        this.toBlack();
        return;
      }
      if (this.color === BLACK) {
        this.color = WHITE;
        this.toWhite();
        return;
      }
    }
    getTd() {
      return this.td
    }
    getColor() {
      return this.color;
    }
    getRow() {
      return this.row;
    }
    getCol() {
      return this.col;
    }
    getTextContent() {
      return this.td.textContent;
    }
  }

  class Board {
    constructor() {
      this.cells = [];
      this.colmns = [];
      this.board = document.getElementById('board');
      this.setUp();
    }
    setUp() {
      for (let r = 0; r < 8; r++) {
        const tr = document.createElement('tr');
        this.colmns = [];
        for (let i = 0; i < 8; i++) {
          const cell = new Cell(this, r, i);
          this.colmns.push(cell)
          tr.appendChild(cell.getTd());
        }
        this.board.appendChild(tr);
        this.cells.push(this.colmns);
      }
    }
    initialize() {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          this.cells[i][j].initialize();
        }
      }
      let result = this.countScore();

    }
    start() {
      console.log('START');
      this.cells[3][3].toBlack();
      this.cells[3][4].toWhite();
      this.cells[4][3].toWhite();
      this.cells[4][4].toBlack();
      currentPrayer = BLACK;
      this.changePrayer();
      let result = this.countScore();
    }
    countScore() {
      let whites = 0;
      let blacks = 0;
      this.cells.forEach(colmns => {
        colmns.forEach(colmn => {
          if (colmn.getColor() === WHITE) {
            whites++;
          } else if (colmn.getColor() === BLACK) {
            blacks++;
          }
        })
      })
      console.log('whites => ' + whites);
      console.log('blacks => ' + blacks);
      const white = document.getElementById('white');
      white.textContent = whites;
      const black = document.getElementById('black');
      black.textContent = blacks;
      return whites + blacks;
    }
    changePrayer() {
      currentPrayer *= -1;
      // console.log('to player => ' + currentPrayer);
      this.prayer = document.getElementById('color');
      if (currentPrayer === WHITE) {
        this.prayer.classList.remove('black');
        this.prayer.classList.add('white');
      } else {
        this.prayer.classList.remove('white');
        this.prayer.classList.add('black');
      }
    }
    check(cell) {
      this.cell = cell;
      this.result = 0;
      this.result += this.checkCells(this.cell, -1, -1, 0, -1);      // up
      this.result += this.checkCells(this.cell, 1, 8, 0, -1);        // under
      this.result += this.checkCells(this.cell, 0, -1, -1, -1);      // left
      this.result += this.checkCells(this.cell, 0, -1, 1, 8);        // right
      this.result += this.checkCells(this.cell, -1, -1, -1, -1);     // up left
      this.result += this.checkCells(this.cell, -1, -1, 1, 8);       // up right
      this.result += this.checkCells(this.cell, 1, 8, -1, -1);       // under left
      this.result += this.checkCells(this.cell, 1, 8, 1, 8);         // under right

      if (this.result > 0) {
        this.changePrayer();
      }
    }
    checkCells(cell, rowInc, rowEnd, colInc, colEnd) {
      this.cell = cell;
      this.opponentCount = 0;
      this.result = false;
      this.row = this.cell.getRow();
      this.col = this.cell.getCol();
      this.invertCells = [];

      let r = this.row + rowInc;
      let c = this.col + colInc;
      while (r !== rowEnd && c !== colEnd) {
        // console.log('r => '+ r + ' c => ' + c);

        const checkCell = this.cells[r][c];
        if (checkCell.getColor() === currentPrayer * -1) {
          // console.log('=> A');
          this.opponentCount++;
          this.invertCells.push(checkCell);
        }
        if (checkCell.getColor() === 0) {
          // console.log('=> B ' + checkCell.getTextContent());
          this.result = false;
          break;
        }
        if (checkCell.getColor() === currentPrayer) {
          // console.log('=> C');
          this.result = true;
          break;
        }
        r += rowInc;
        c += colInc;
      }
      console.log('op=>' + this.opponentCount + ' : result=>' + this.result);

      if (this.result && this.opponentCount > 0) {
        this.invertCells.forEach(cell => {
          cell.toInvert();
        })
        cell.toCurrentColor();
        return this.opponentCount;
      }
      return 0;
    }
  }

  let currentPrayer = 0;
  let playing = false;
  const board = new Board();
  
  // path button
  const path = document.getElementById('path');
  path.addEventListener('click', () => {
    console.log('path');
    board.changePrayer();
  })

  // strat button
  const start = document.getElementById('start');
  start.addEventListener('click', () => {
    if (!playing) {
      board.start();
      playing = true;
      start.textContent = 'RESET';
    } else {
      playing = false;
      start.textContent = 'START';
      board.initialize();
    }
  })

}