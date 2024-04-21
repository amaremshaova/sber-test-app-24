import { encoded, translations } from './data.js';

const constDecoding = ['groupId', 'service', 'formatSize', 'ca'];

const decode = (encoded, translations) => {
  const uniqueIds = [];
  const decodedArray = encoded.map((elem) => {
    const keys = Object.keys(elem);

    const newObject = { ...elem };

    keys.forEach((key) => {
      if (!constDecoding.includes(key))
        newObject[key] = translations[Number(elem[key])];

      if (!uniqueIds.includes(key)) uniqueIds.push(key);
    });

    return newObject;
  });

  console.log('Уникакальные id', uniqueIds);
  return decodedArray;
};

console.log("Let's rock");
console.log(decode(encoded, translations));

// console.log(decoded)
