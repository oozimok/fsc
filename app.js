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

const myBinaryFile1_1 = new BinaryFile('FSC_NU85056_0120007C_werk_fscs_id_1027.fsc', 'r');
(async function () {
    try {
        await myBinaryFile1_1.open();

        await parse(myBinaryFile1_1, log('werk 1', 10));

        await myBinaryFile1_1.close();

    } catch (err) {
        console.log(`There was an error: ${err}`);
    }
})();
//
// const myBinaryFile2 = new BinaryFile('FSC_NU85056_0120007C_marketing_703.fsc', 'r');
// (async function () {
//     try {
//         await myBinaryFile2.open();
//
//         await parse(myBinaryFile2, log('marketing', 10));
//
//         await myBinaryFile2.close();
//
//     } catch (err) {
//         console.log(`There was an error: ${err}`);
//     }
// })();
//
// const myBinaryFile3 = new BinaryFile('FSC_NU85056_0120007C_kundle_703.fsc', 'r');
// (async function () {
//     try {
//         await myBinaryFile3.open();
//
//         await parse(myBinaryFile3, log('kundle 0', 10));
//
//         await myBinaryFile3.close();
//
//     } catch (err) {
//         console.log(`There was an error: ${err}`);
//     }
// })();
//
// const myBinaryFile3_1 = new BinaryFile('FSC_NU85056_0120007C_kundle_703_fgn_lang.fsc', 'r');
// (async function () {
//     try {
//         await myBinaryFile3_1.open();
//
//         await parse(myBinaryFile3_1, log('kundle 1', 10));
//
//         await myBinaryFile3_1.close();
//
//     } catch (err) {
//         console.log(`There was an error: ${err}`);
//     }
// })();
//
// const myBinaryFile3_2 = new BinaryFile('FSC_NU85056_0120007C_kundle_703_keine_indiv.fsc', 'r');
// (async function () {
//     try {
//         await myBinaryFile3_2.open();
//
//         await parse(myBinaryFile3_2, log('kundle 2', 10));
//
//         await myBinaryFile3_2.close();
//
//     } catch (err) {
//         console.log(`There was an error: ${err}`);
//     }
// })();
//
// const myBinaryFile4 = new BinaryFile('FSC_NU85056_0120007C_vertrieb_703.fsc', 'r');
// (async function () {
//     try {
//         await myBinaryFile4.open();
//
//         await parse(myBinaryFile4, log('vertrieb', 10));
//
//         await myBinaryFile4.close();
//
//     } catch (err) {
//         console.log(`There was an error: ${err}`);
//     }
// })();

let parse = async (binary, log) => {
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

    const requesterAlgorithm = await binary.readUInt8(position);
    switch(requesterAlgorithm) {
        case 0:
            position += 2;
            log(position, 'requesterId', await binary.readUInt16(position));
            log(position, 'requesterTyp', 'Marketing');
            position += 2;
            break;
        case 2:
            log(position, 'requesterId', await binary.readUInt16(position));
            log(position, 'requesterTyp', 'Werk');
            position += 2;
            break;
        case 32:
            position += 1;
            const requesterAlgorithmTwo = await binary.readUInt8(position);
            if (requesterAlgorithmTwo === 32) {
                position += 1;
                log(position, 'requesterId', await binary.readString(3, position));
                log(position, 'requesterTyp', 'Vertrieb');
                position += 3;
            } else {
                log(position, 'requesterId', await binary.readString(3, position));
                log(position, 'requesterTyp', 'Kundle');
                position += 3;
            }
            break;
        default:
            log(position, 'requesterAlgorithm', `unknown = ${requesterAlgorithm}`);
            process.exit();
    }

    const indivMerkmType = await binary.readUInt8(position);
    position += 1;
    switch(indivMerkmType) {
        case 0:
            log(position, 'indivMerkmType',  'keine_indiv');
            position += 10;
            break;
        case 1:
            log(position, 'indivMerkmType',  'FGN_kurz');
            log(position, 'fgnKurz',  await binary.readString(8, position));
            position += 17;
            break;
        case 2:
            log(position, 'indivMerkmType',  'FGN_lang');
            log(position, 'fgnKurz',  await binary.readString(8, position));
            position += 17;
            break;
        default:
            log(position, 'indivMerkmType', `unknown = ${indivMerkmType}`);
            process.exit();
    }

    const fscsId = await binary.readUInt16(position);
    log(position, 'fscsId', fscsId);
    position += 2;

    const date = await binary.readString(13, position);
    log(position, 'date', datetime(date).toUTCString());
};

let log = (prefix = 'Log:', length = 4) => {
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
};

const datetime = (dateString) => {
    // YYYYMMDDhhmmZ
    let reggie = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})Z/;
    let dateArray = reggie.exec(dateString);
    return new Date(
        (+dateArray[1]),
        (+dateArray[2])-1, // Careful, month starts at 0!
        (+dateArray[3]),
        (+dateArray[4]),
        (+dateArray[5]),
        0
    );
};
