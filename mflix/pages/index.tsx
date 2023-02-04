import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import styles from '../styles/Home.module.css';
import { InferGetServerSidePropsType } from 'next'
import axios from 'axios'

export async function getServerSideProps(context: any) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

const govee_key = 'a1cc86f4-4677-42c6-b2c9-5d405d8997a5'

const handleClickOn = () => {
  const headers = {
    'content-type': 'application/json', 
    'Govee-API-Key': govee_key 
  };
  const payload = {
    'device':'e1:66:34:20:03:6d:62:62',
    'model':'H5081',
    'cmd': {
        'name': 'turn',
        'value': 'on'
      }
  }
  axios.put('https://developer-api.govee.com/v1/devices/control', payload, { headers })
    .then(response => console.log(response.data));
  // change a univerasl state that python script can acsess to tell it the curr state of lamp
  console.log("ON");
}

const handleClickOff = () => {
  const headers = {
    'content-type': 'application/json', 
    'Govee-API-Key': govee_key 
  };
  const payload = {
    'device':'e1:66:34:20:03:6d:62:62',
    'model':'H5081',
    'cmd': {
        'name': 'turn',
        'value': 'off'
      }
  }
  axios.put('https://developer-api.govee.com/v1/devices/control', payload, { headers })
    // change a univerasl state that python script can acsess to tell it the curr state of lamp
    var axios = require('axios');
var data = JSON.stringify({
    "collection": "Lamp",
    "database": "LampState",
    "dataSource": "LampData",
    "projection": {
        "_id": 1
    }
});
            
var config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-dmqqu/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'JhSY8KNXAxiayUuYV2Ir4w9ulG5lJacc6Ru8otD9P04FsWdQW6QbFcbS3B7X00ow',
    },
    data: data
};
            
axios(config)
    .then(function (response: { data: any; }) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error: any) {
        console.log(error);
    });

  console.log("OFF");
}

const handleClickOffForNight = () => {
  const headers = {
    'content-type': 'application/json', 
    'Govee-API-Key': govee_key 
  };
  const payload = {
    'device':'e1:66:34:20:03:6d:62:62',
    'model':'H5081',
    'cmd': {
        'name': 'turn',
        'value': 'off'
      }
  }
  axios.put('https://developer-api.govee.com/v1/devices/control', payload, { headers })
    .then(response => console.log(response.data))
    // change a univerasl state that python script can acsess to tell it the curr state of lamp

  console.log("OFF FOR NIGHT");
}

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lamp Control!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <a>Lamp Control!</a>
        </h1>

        <div className={styles.grid}>
          
          <div onClick={handleClickOn} className={styles.card}>
            <h3>ON  &rarr;</h3>
          </div>

          <div onClick={handleClickOff} className={styles.card}
          >
            <h3>OFF &rarr;</h3>
          </div>

          <div onClick={handleClickOffForNight} className={styles.card}>
            <h3>Turn off for night &rarr;</h3>
            <p>Light will be turned off from now until 7am</p>
          </div>
        </div>
      </main>

      <footer>
        <a>
          Powered by Saketh
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
