import Notes from "./Notes";
const Home = (props) => {
  return (
    <div>
      {/* Check your Note  */}
   <Notes showAlert={props.showAlert}/>
    </div>
  );
};

export default Home;
