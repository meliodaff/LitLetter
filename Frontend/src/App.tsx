import { useState } from "react";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const [genre, setGenre] = useState("");
  const [spicy, setSpicy] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!genre) {
      alert("choose genre");
      return;
    }
    setResponse("");
    setLoading(true);
    try {
      const response = await axios.post(`https://litletter.onrender.com/`, {
        message,
        isSpicy: spicy,
        genre,
      });
      console.log(response.data.message);
      setResponse(response.data.message);
    } catch (error) {
      setResponse(String(error + "Contact Jv to fix the server"));
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <>
      <Header />
      <main>
        <form>
          <div className="genre-container">
            <label>Select genre</label>
            <select value={genre} onChange={handleChange}>
              <option value="">genre...</option>
              <option value="mystery">Mystery</option>
              <option value="fantasy">Fantasy</option>
              <option value="thriller">Thriller</option>
              <option value="horror">Horror</option>
              <option value="romance">Romance</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
          <div className="message-container">
            <textarea
              placeholder="Your message..."
              rows={10}
              cols={50}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            ></textarea>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={spicy}
              onChange={(event) => setSpicy(event.target.checked)}
            />
            <label>Make it spicy? 🌶️</label>
          </div>
          <div className="generate-container">
            <button onClick={handleClick}>Generate</button>
          </div>
          <div className="result-container">
            {response ? <p> {response}</p> : loading ? <p>loading</p> : ""}
          </div>
        </form>
      </main>
    </>
  );
}

export default App;
