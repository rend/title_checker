import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, Fragment } from 'react';

export default function Home() {
  const [data, setData] = useState( { text:'' });
  const [query, setQuery] = useState();
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const addLineBreaks = string =>
  string.split('\n').map((text, index) => (
    <Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </Fragment>
  ));

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
      setIsLoading(true);
      console.log("SEARCH: " + search);
      const res = await fetch(`/api/openai`, {
        body: JSON.stringify({
          name: search
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    }};

    fetchData();
  }, [search]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Title Checker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>Title Checker</a>
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Enter Title Text:</h3>
            <textarea
          className={styles.textarea}
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        < br />< br />
        <button
          type="button"
          className={styles.buttonNine}
          onClick={() =>
            setSearch(query)
          }
        >
          Check
        </button>

        </div>
        <div className={styles.card}>
          <h3>Result:</h3>  
          {isLoading ? (
            <div>Loading ...</div>
         ) : (
           <span>
            <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
           </span>
           )}

          </div>
        </div>
      </main>
    </div>
  );
}