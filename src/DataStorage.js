import _ from 'lodash';

let DataStorage = {};
DataStorage.generateReels = function(reelAmount, symbolsAmount){
    let initialArr = [];
    let reels = [];
    for (let i = 0; i < symbolsAmount; i++){
        initialArr.push(i);
    }

    for (let i = 0; i < reelAmount; i++){
        reels[i] = _.shuffle(initialArr);
    }
    return reels;
}

export {DataStorage};



