import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import chalk from 'chalk';
import { faker } from '@faker-js/faker';
import { promises as fs, readFileSync} from 'fs';

// 1. Baca config
const config = JSON.parse(readFileSync('./config.json', 'utf-8'))

function encryptToTargetHex(input) {
  let hexResult = "";
  for (const char of input) {
    const encryptedCharCode = char.charCodeAt(0) ^ 0x05;
    hexResult += encryptedCharCode.toString(16).padStart(2, "0");
  }
  return hexResult;
}

const getEmailRandom = async () => {
    try {
        const res = await fetch('https://generator.email/');
        const text = await res.text();
        const $ = cheerio.load(text);
        const result = [];
        $('.e7m.tt-suggestions').find('div > p').each(function (index, element) {
            result.push($(element).text());
        });
        return result;
    } catch (err) {
        console.error(chalk.red("Error generating email domains:", err.message));
        return [];
    }
};

const functionGetLink = async (email, domain) => new Promise((resolve, reject) => {
    fetch('https://generator.email/', {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': `_gid=GA1.2.989703044.1735637209; embx=%5B%22xaviermoen51%40dogonoithatlienha.com%22%2C%22sadahayuv%40jagomail.com%22%2C%22sadahayua%40jagomail.com%22%2C%22sadahayu%40jagomail.com%22%2C%22ajacoba%40auhit.com%22%5D; _ga=GA1.1.1696815852.1733235907; __gads=ID=08e2714256afd00c:T=1733235907:RT=1735638862:S=ALNI_MaFvYNYLhdTjGzS2xa3eZ3jls6QMQ; __gpi=UID=00000f7f6013ca38:T=1733235907:RT=1735638862:S=ALNI_MayYarsiugqTzh0Ky4wHiYNrSnGtQ; __eoi=ID=101f6e905a8358a1:T=1733235907:RT=1735638862:S=AA-AfjZCYAfxlwf-nyRYeP_9J9rE; FCNEC=%5B%5B%22AKsRol8j6KSk9Pga59DuS0D4a2pk72ZTqwfVO82pNZ4h-bO_EWCi04aWAU6ULkfWs6oHpsd6Cs949FJ6fmNfbqNhHt8GslL8Aa0Dzr20gerHRB_kL3qK8nW6DeD0WzT9KfeamIWXb1LyD2b7IDCPM94I8fUvBRcTqA%3D%3D%22%5D%5D; _ga_1GPPTBHNKN=GS1.1.1735637208.2.1.1735638882.38.0.0; surl=${domain}%2F${email}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'follow'
    })
        .then(res => res.text())
        .then(async text => {
            const $ = cheerio.load(text);
            const src = $("#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy > div > div > div:nth-child(2) > p:nth-child(2) > span").text().trim();
            resolve(src)
        })
        .catch(err => reject(err));
});

async function regist_sendRequest(encryptedEmail, encryptedPassword) {
  try {
    const url = new URL('https://www.capcut.com/passport/web/email/send_code/');
    const queryParams = {
      aid: '348188',
      account_sdk_source: 'web',
      language: 'en',
      verifyFp: 'verify_m7euzwhw_PNtb4tlY_I0az_4me0_9Hrt_sEBZgW5GGPdn',
      check_region: '1'
    };
    
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const formData = new URLSearchParams();
    formData.append('mix_mode', '1');
    formData.append('email', encryptedEmail); // Hex encoded
    formData.append('password', encryptedPassword);     // XOR encoded
    formData.append('type', '34');
    formData.append('fixed_mix_mode', '1');
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    const data = await response.json();
    return data

  } catch (error) {
    console.error('Error:', error);
  }
}

async function verify_sendRequest(encryptedEmail, encryptedPassword, encryptedCode) {
  try {
    const originalDate = faker.date.birthdate()
    const dateObj = new Date(originalDate);
    const formattedDate = dateObj.toISOString().split('T')[0];
    const url = new URL('https://www.capcut.com/passport/web/email/register_verify_login/');
    const queryParams = {
      aid: '348188',
      account_sdk_source: 'web',
      language: 'en',
      verifyFp: 'verify_m7euzwhw_PNtb4tlY_I0az_4me0_9Hrt_sEBZgW5GGPdn',
      check_region: '1'
    };

    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const formData = new URLSearchParams();
    formData.append('mix_mode', '1');
    formData.append('email', encryptedEmail); 
    formData.append('code', encryptedCode);
    formData.append('password', encryptedPassword);
    formData.append('type', '34');
    formData.append('birthday', formattedDate);
    formData.append('force_user_region', 'ID');
    formData.append('biz_param', '%7B%7D');
    formData.append('check_region', '1');
    formData.append('fixed_mix_mode', '1');
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' // Contoh UA
      },
      body: formData
    });
    const data = await response.json();
    return data

  } catch (error) {
    console.error('Error:', error);
  }
}

async function saveToFile(filename, data) {
    await fs.writeFile(filename, data, { flag: 'a' });
}

// Jalankan fungsi

(async () => {
  const loopCount = process.argv[2] ? parseInt(process.argv[2]) : 1;

  console.log(chalk.yellow(`Starting account creation loop (${loopCount} iterations)`));

  for (let i = 1; i <= loopCount; i++) {
    try {
      console.log(chalk.cyan(`\n[Account ${i}/${loopCount}]`));
      console.log(chalk.blue('Generating random email...'));
      
      const domainList = await getEmailRandom();
      const domain = domainList[Math.floor(Math.random() * domainList.length)];
      const name = faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${name}@${domain}`;
      console.log(chalk.green('Generated Email:'), email);
      const password = config.password;
      const encryptedHexEmail = encryptToTargetHex(email);
      const encryptedHexPassword = encryptToTargetHex(password);
      
      const reqnya = await regist_sendRequest(encryptedHexEmail, encryptedHexPassword);
      
      if (reqnya.message === "success") {
        console.log(chalk.blue('Waiting for verification email...'));
        
        let verificationCode;
        do {
          verificationCode = await functionGetLink(email.split('@')[0], email.split('@')[1]);
          if (!verificationCode) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } while (!verificationCode);
        
        console.log(chalk.green('Verification Code:'), verificationCode);
        const encryptedHexCode = encryptToTargetHex(verificationCode);
        
        const verifyData = await verify_sendRequest(encryptedHexEmail, encryptedHexPassword, encryptedHexCode);
        
        if (verifyData.message === "success") {
          const walletData = `${email}|${password}\n`;
          await saveToFile(`accounts.txt`, walletData);
          console.log(chalk.green('Account saved successfully'));
        }
      } else {
        console.log(chalk.red('Error creating account'));
      }
    } catch (error) {
      console.log(chalk.red(`Error in iteration ${i}:`), error.message);
    }
  }

  console.log(chalk.yellow('\nFinished all iterations!'));
})()