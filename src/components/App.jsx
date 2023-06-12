import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from 'services/fetchImages';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loading from './Loader';
import Modal from './Modal';

export const App = () => {
  const [page, setPage] = useState(1);
  const [value, setValue] = useState('');
  const [gallery, setGallery] = useState([]);
  const [status, setStatus] = useState('idle');
  const [url, setUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (!value) return;

    async function fetchData() {
      setStatus('panding');
      try {
        const {
          data: { totalHits, hits },
        } = await fetchImages(page, value);
        if (!hits.length) {
          throw new Error();
        }
        setGallery(prevState => {
          return [...prevState, ...hits];
        });
        setStatus('resolved');
        setShowBtn(page < Math.ceil(totalHits / 12));
      } catch {
        errorNotify();
        setStatus('rejected');
      }
    }
    fetchData();
  }, [value, page]);

  const handleUpdateValue = currentValue => {
    const prevValue = value;
    if (prevValue !== currentValue && currentValue.trim()) {
      setValue(currentValue);
      setPage(1);
      setGallery([]);
    }
    return;
  };

  const handleIncrementPage = () => {
    setPage(prevState => prevState + 1);
  };

  const handleUpdateImg = (url = '') => {
    setShowModal(!showModal);
    setUrl(url);
  };

  function errorNotify() {
    toast.error('No result for your request. Please try again!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <Searchbar onSubmit={handleUpdateValue} />

      <ImageGallery gallery={gallery} value={value} onClick={handleUpdateImg} />

      {status === 'panding' && <Loading />}

      {status === 'resolved' && showBtn && (
        <Button title="Load more" onClick={handleIncrementPage}></Button>
      )}

      {status === 'rejected' && <ToastContainer />}

      {showModal && <Modal url={url} value={value} reset={handleUpdateImg} />}
    </div>
  );
};
