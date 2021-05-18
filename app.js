'use strict';

const BinaryFile = require('binary-file');

const myBinaryFile1 = new BinaryFile('FSC_NU85056_0120007C_werk_703.fsc', 'r');
(async function () {
    try {
        await myBinaryFile1.open();

        await parse(myBinaryFile1, log('werk', 10));

        await myBinaryFile1.close();

    } catch (err) {
        console.log(`There was an error: ${err}`);
    }
})();

const myBinaryFile2 = new BinaryFile('FSC_NU85056_0120007C_marketing_703.fsc', 'r');
(async function () {
    try {
        await myBinaryFile2.open();

        await parse(myBinaryFile2, log('marketing', 10));

        await myBinaryFile2.close();

    } catch (err) {
        console.log(`There was an error: ${err}`);
    }
})();

const myBinaryFile3 = new BinaryFile('FSC_NU85056_0120007C_kundle_703.fsc', 'r');
(async function () {
    try {
        await myBinaryFile3.open();

        await parse(myBinaryFile3, log('kundle', 10));

        await myBinaryFile3.close();

    } catch (err) {
        console.log(`There was an error: ${err}`);
    }
})();

const myBinaryFile4 = new BinaryFile('FSC_NU85056_0120007C_vertrieb_703.fsc', 'r');
(async function () {
    try {
        await myBinaryFile4.open();

        await parse(myBinaryFile4, log('vertrieb', 10));

        await myBinaryFile4.close();

    } catch (err) {
        console.log(`There was an error: ${err}`);
    }
})();

let parse = async function(binary, log) {
    let position = 0;

    // for(let i = 0; i < 100; i++) {
    //     const value1 = await binary.readUInt16(i);
    //     if (value1 === 702 || value1 === 703) {
    //         log(i - 1, '^', await binary.readUInt8(i - 1));
    //         log(i, '=', value1);
    //     }
    //     const value2 = await binary.readString(3, i);
    //     if (value2 === '702' || value2 === '703') {
    //         log(i - 1, '^', await binary.readUInt8(i - 1));
    //         log(i, '=', value2);
    //     }
    // }



    const version = await binary.readUInt8(position);
    log(position, 'version', version);
    position += 1;

    const swIdType = await binary.readUInt8(position);
    log(position, 'swIdType', swIdType);
    position += 1;

    const appNr = await binary.readUInt16(2);
    log(position, 'appNr', appNr);
    position += 2;

    const upgradeIndex = await binary.readUInt16(position);
    log(position, 'upgradeIndex', upgradeIndex);
    position += 2;

    position += 2;
    // -----

    const lieferantenId = await binary.readString(8, position);
    log(position, 'lieferantenId', lieferantenId);
    position += 8;

    const bestellNr = await binary.readString(7, position);
    log(position, 'bestellNr', bestellNr);
    position += 7;

    const requesterAlgorism = await binary.readUInt8(position);
    switch(requesterAlgorism) {
        case 0:
            position += 2;
            log(position, 'requesterId', await binary.readUInt16(position));
            log(position, 'requesterTyp', 'Marketing');
            break;
        case 2:
            log(position, 'requesterId', await binary.readUInt16(position));
            log(position, 'requesterTyp', 'Werk');
            break;
        case 32:
            position += 1;
            const requesterAlgorismTwo = await binary.readUInt8(position);
            if (requesterAlgorismTwo === 32) {
                position += 1;
                log(position, 'requesterId', await binary.readString(4, position));
                log(position, 'requesterTyp', 'Vertrieb');
                position += 4;
            } else {
                log(position, 'requesterId', await binary.readString(4, position));
                log(position, 'requesterTyp', 'Kundle');
                position += 4;
            }
            break;
        default:
            log(position, 'requesterAlgorism', requesterAlgorism);
            process.exit();
    }

    // const indivMerkmType = await binary.readUInt8(position);
    // switch(indivMerkmType) {
    //     case 0: console.log(`(${position}) IndivMerkmType (${indivMerkmType}): keine_indiv`); position += 1; break;
    //     case 1: console.log(`(${position}) IndivMerkmType (${indivMerkmType}): FGN_kurz`); position += 1; break;
    //     case 2: console.log(`(${position}) IndivMerkmType (${indivMerkmType}): FGN_lang`); position += 1; break;
    //     default: console.log(`(${position}) IndivMerkmType (${indivMerkmType}): undefined\nEXIT`); process.exit(); break;
    // }
    //
    // const fgnKurz = await binary.readString(8, position);
    // console.log(`(${position}) fgnKurz: ${fgnKurz}`);
    // position += 8;
    //
    // position += 11;
    // // --
    //
    // const date = await binary.readString(13, position);
    // console.log(`(${position}) date: ${date}`);
}

let log = function(prefix = 'Log:', length = 4) {
    return function(position, key, value) {
        console.log(`${pad(prefix, length)} (${position}) ${key}: ${value}`);
    }

    function pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = ' ' + str;
        }
        return str;
    }
}
