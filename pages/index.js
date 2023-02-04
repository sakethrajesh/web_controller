import Head from 'next/head'
import styles from '../styles/Home.module.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://127.0.0.1:8000");

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
  socket.emit('on', {'status':1})
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
    .then(response => console.log(response.data));
    // change a univerasl state that python script can acsess to tell it the curr state of lamp
  socket.emit('off', {'status':0})
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
    let lamp = Lamp.findOneAndUpdate( { "_id" : "63c7136e3852c1d06c488f96" },
    { $set: { "state" : 1 } })

  console.log("OFF FOR NIGHT");
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Lamp Control!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Lamp Control!</a>
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