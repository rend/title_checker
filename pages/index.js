import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, Fragment, useReducer } from 'react';
import axios from "axios";
import DropZone from "../components/DropZone";

export default function Home() {
  const [data, setData] = useState( { text:'' });
  const [query, setQuery] = useState();
  const [query2, setQuery2] = useState();
  const [search, setSearch] = useState();
  const [search2, setSearch2] = useState();
  const [mode, setMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      case "REMOVE_ALL_FILES":
        return { ...state, fileList: []};
      default:
        return state;
    }
  };

  const [data1, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async() => {
    //setUploadingStatus("Uploading the file to AWS S3");

    let { data } = await axios.post(`/api/text`, {
      name: file.name,
      type: file.type
    });

    const url = data.url;

    await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*"
      }
    });

    setFile(null);
  }

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
      console.log("REGISTER: " + search);
      console.log("ADDITIONAL: " + search2);
      console.log("MODE: " + mode);
      const res = await fetch(`/api/openai`, {
        body: JSON.stringify({
          register: search,
          additional: search2,
          mode: mode
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
        <label className={'switch'}>
          <input type="checkbox" onChange={event => setMode(event.target.checked)} />
          <span className={'slider round'}></span>
        </label>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Enter Title Text:</h3>
            <textarea
          className={styles.textarea}
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Register..."
        />
        <textarea
          className={styles.textarea}
          value={query2}
          onChange={event => setQuery2(event.target.value)}
          placeholder="Other documents..."
            />
         {/* <h1 className={styles.title}></h1> */}
        {/* Pass state data and dispatch to the DropZone component */}
        {/* <DropZone data={data1} dispatch={dispatch} />
        < br />< br /> */}
        <button
          type="button"
          className={styles.buttonNine}
          onClick={() => {
            setSearch(query);
            setSearch2(query2) }
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
        {/* <div>
        <input type="file" onChange={(e) => selectFile(e)} />
        {file && (
          <>
            <p>Selected file: {file.name}</p>
            <button
              onClick={uploadFile}
              className=" bg-purple-500 text-white p-2 rounded-sm shadow-md hover:bg-purple-700 transition-all"
            >
              Upload a File!
            </button>
          </>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
        {uploadedFile && <img src={uploadedFile} />}
        </div> */}
      </main>
    </div>
  );
}