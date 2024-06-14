export function AuthorList(props) {
  const { data } = props;
  return (
    <>
      <div>AuthorList</div>
      {data.map((author, index) => {
        return <div key={author.name}>{author.name}</div>;
      })}
    </>
  );
}
