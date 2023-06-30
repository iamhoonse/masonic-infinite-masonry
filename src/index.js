import React from "react";
import ReactDOM from "react-dom";
import useWindowScroll from "@react-hook/window-scroll";
import catNames from "cat-names";
import cats from "./cats";
import { styles } from "./theme";
import { Masonry, useInfiniteLoader } from "masonic";

const App = () => {
  const [items, setItems] = React.useState(getFakeItems);
  const maybeLoadMore = useInfiniteLoader(
    async (startIndex, stopIndex, currentItems) => {
      const nextItems = await getFakeItemsPromise(startIndex, stopIndex);
      setItems((current) => [...current, ...nextItems]);
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 32,
      threshold: 3
    }
  );

  return (
    <main className={style("container")}>
      <div className={style("masonic")}>
        <Masonry
          onRender={maybeLoadMore}
          items={items}
          columnGutter={8}
          columnWidth={172}
          overscanBy={1.25}
          render={FakeCard}
        />
      </div>
      <Header />
    </main>
  );
};

const FakeCard = ({ data: { name, src } }) => (
  <div className={style("card")}>
    <img className={style("img")} alt="kitty" src={src} />
    <span children={name} />
  </div>
);

const Header = () => {
  const scrollY = useWindowScroll(5);
  return (
    <h1 className={style("header", scrollY > 64 && "minify")}>
      <span role="img" aria-label="bricks">
        🧱
      </span>{" "}
      MASONIC
    </h1>
  );
};

const style = styles({
  masonic: `
    padding: 8px;
    width: 100%;
    max-width: 960px;
    margin: 163px auto;
  `,
  container: `
    min-height: 100vh;
    width: 100%;
  `,
  minify: ({ pad, color }) => `
    padding: ${pad.md};
    background-color: ${color.dark};
    color: ${color.light};
  `,
  header: ({ pad, color }) => `
    font-family: Quantico, sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -0.075em;
    color: ${color.body};
    top: 0;
    position: fixed;
    padding: ${pad.xl};
    z-index: 1000;
    width: 100%;
    text-align: center;
    transition: padding 200ms ease-in-out, background-color 200ms 200ms linear;
  `,
  card: ({ shadow, color, pad, radius }) => `
    display: flex;
    flex-direction: column;
    background: ${color.dark};
    border-radius: ${radius.lg};
    justify-content: center;
    align-items: center;
    transition: transform 100ms ease-in-out;
    width: 100%;

    span:last-of-type {
      color: #fff;
      padding: ${pad.md};
    }

    &:hover {
      position: relative;
      background: ${color.light};
      transform: scale(1.125);
      z-index: 1000;
      box-shadow: ${shadow.lg};

      span:last-of-type {
        color: ${color.dark};
        padding: ${pad.md};
      }
    }
  `,
  img: ({ radius }) => `
    width: 100%;
    display: block;
    border-top-left-radius: ${radius.md};
    border-top-right-radius: ${radius.md};
    display: block;
  `
});

const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
const getFakeItems = (start = 0, end = 32) => {
  const fakeItems = [];
  for (let i = start; i < end; i++)
    fakeItems.push({ id: i, src: randomChoice(cats), name: catNames.random() });
  return fakeItems;
};

const getFakeItemsPromise = (start, end) =>
  Promise.resolve(getFakeItems(start, end));

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
