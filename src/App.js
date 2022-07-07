import "./App.css";

function App() {
  return (
    <div className="App">
      <main className="home">
        <div className="home__bg">
          <div className="overlay"></div>
          <img src="/assets/bg.jpg" alt="bg" className="bg__img" />
        </div>

        <div className="home__content">
          <h1 className="heading">prodios todo</h1>

          <form className="inputForm">
            <input
              type="text"
              className="input inputForm__title"
              placeholder="Todo Title"
            />

            <textarea
              rows="4"
              className="input inputForm__desc"
              placeholder="Todo Description"
            ></textarea>

            <button className="inputForm__button">Add</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
