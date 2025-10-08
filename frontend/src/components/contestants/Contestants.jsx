



import './contestants.css'
import { useNavigate } from 'react-router-dom';
import image from "../../../public/testContestantImage.jpeg"
import { useContestants } from './useContestants';


const Contestants = ({adminDashboard}) => {
  const navigate = useNavigate()
  // const { data: contestants, isLoading, isError, error } = useContestants();
const contestants = [
  {
    id: 1,  
    fullname: "Chiamaka Johnson",
    image: image,
    bio: "Confident, elegant, and passionate about women empowerment.",
    contestant_number: 1,
    votes: 2
  },
  {
    id: 2,  
    fullname: "Zainab Musa",
    image: image,
    bio: "A creative soul who loves art, culture, and inspiring others.",
    contestant_number: 2,
    votes: 4
  },
  {
    id: 3,  
    fullname: "Ifeoma Okafor",
    image: image,
    bio: "Ambitious and kind-hearted, aiming to make positive change.",
    contestant_number: 3,
    votes: 7
  },
  {
    id: 4,
    fullname: "Amara Bello",
    image: image,
    bio: "Energetic and charismatic, always leading by example.",
    contestant_number: 4,
    votes: 3
  },
  {
    id: 5,
    fullname: "Funke Adeyemi",
    image: image,
    bio: "Passionate about community service and uplifting others.",
    contestant_number: 5,
    votes: 5
  },
  {
    id: 6,
    fullname: "Ngozi Eze",
    image: image,
    bio: "Determined and resilient, never afraid of challenges.",
    contestant_number: 6,
    votes: 6
  },
  {
    id: 7,
    fullname: "Halima Yusuf",
    image: image,
    bio: "Creative thinker with a love for innovation and culture.",
    contestant_number: 7,
    votes: 8
  },
  {
    id: 8,
    fullname: "Aisha Abdullahi",
    image: image,
    bio: "Friendly, inspiring, and committed to making a difference.",
    contestant_number: 8,
    votes: 2
  },
  {
    id: 9,
    fullname: "Blessing Nwankwo",
    image: image,
    bio: "Optimistic and hardworking, always striving for excellence.",
    contestant_number: 9,
    votes: 9
  }
];

  


  // if (isLoading) return <p>Loading contestants...</p>;
  // if (isError) return <p className='alert alert-danger'>Failed to load contestants</p>;

  return (
    <div className="contestants-container">

      <div className="contestants-flex">
        {contestants.map((contestant) => (
          <div key={contestant.id} className="contestant-card">
            <div className="contestant-image-wrapper">
              <img src={contestant.image} alt={contestant.name} className="contestant-image" />
            </div>
            <div className="contestant-details">
              <h3 className={`contestant-name ${adminDashboard ? "name-black" : ""}`}>{contestant.fullname}</h3>
              <p className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`}>
                Contestant Number {String(contestant.contestant_number).padStart(2, "0")}
              </p>

              <p className={`contestant-desc ${adminDashboard ? "text-muted" : ""}`}>{contestant.bio}</p>

              {/* ✨ Underline Divider */}
              <div className="contestant-divider text-muted"></div>

              {/* 🗳️ Vote Count */}
              <div className="vote-count">
                <span><span className="display-5 fw-bold text-center">{contestant.votes.toLocaleString()}</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span>
                {/* <span><span className="display-5 fw-bold text-center">0</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span> */}
              </div>

              {/* 🌟 Vote Button */}
              {
              !adminDashboard &&
              <button className="vote-btn"   onClick={() => {
                const slug = contestant.fullname.toLowerCase().replace(/\s+/g, "-"); // convert "John Doe" → "john-doe"
                navigate(`/vote-for/${slug}`);
              }}>Vote Now $200</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contestants;







// import './contestants.css'
// import { useNavigate } from 'react-router-dom';
// import image from "../../../public/testContestantImage.jpeg"
// import { useContestants } from './useContestants';


// const Contestants = ({adminDashboard}) => {
//   const navigate = useNavigate()  
//   const { data: contestants, isLoading, isError, error } = useContestants();
  // const contestants = [
  //   {
  //     id: 1,  
  //     name: "Chiamaka Johnson",
  //     // image: "https://www.vote.missonenigeria.com/storage/contestants/1758742129_precious-mohammed.jpeg",
  //     image: image,
  //     description: "Confident, elegant, and passionate about women empowerment.",
  //     votes: 2
  //   },
  //   {
  //     id: 2,  
  //     name: "Zainab Musa",
  //     // image: "https://www.vote.missonenigeria.com/storage/contestants/1758677512_angela-ozalagba.jpeg",
  //     image: image,
  //     description: "A creative soul who loves art, culture, and inspiring others.",
  //     votes: 4
  //   },
  //   {
  //     id: 3,  
  //     name: "Ifeoma Okafor",
  //     // image: "https://www.vote.missonenigeria.com/storage/contestants/1758740341_ayomide-adegbeola.jpeg",
  //     image: image,
  //     description: "Ambitious and kind-hearted, aiming to make positive change.",
  //     votes: 7
  //   }
  // ];

//   if (isLoading) return <p>Loading contestants...</p>;
//   if (isError) return <p className='alert alert-danger'>Failed to load contestants</p>;

//   return (
//     <div className="contestants-container">  
//       {/* <h1 className="display-5 fw-bold text-center">MEET THE CONTESTANTS</h1>
//       <p className="mb-4" style={{fontSize: "20px", textAlign: "center", fontWeight: "600", color: "#aaa"}}>
//         Vote for your favorite and help them win the crown
//       </p> */}

//       <div className="contestants-flex">
//         {contestants.map((contestant) => (
//           <div key={contestant.id} className="contestant-card">  
//             <div className="contestant-image-wrapper">
//               <img src={contestant.image} alt={contestant.name} className="contestant-image" />
//             </div>
//             <div className="contestant-details">
//               <h3 className={`contestant-name ${adminDashboard ? "name-black" : ""}`}>{contestant.fullname}</h3>
//               <p className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`}>
//                 Contestant Number {String(contestant.contestant_number).padStart(2, "0")}
//               </p>

//               <p className={`contestant-desc ${adminDashboard ? "text-muted" : ""}`}>{contestant.bio}</p>

//               {/* ✨ Underline Divider */}
//               <div className="contestant-divider text-muted"></div>

//               {/* 🗳️ Vote Count */}
//               <div className="vote-count">
//                 {/* <span><span className="display-5 fw-bold text-center">{contestant.votes.toLocaleString()}</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span> */}
//                 <span><span className="display-5 fw-bold text-center">0</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span>
//               </div>

//               {/* 🌟 Vote Button */}
//               {
//               !adminDashboard &&  
//               <button className="vote-btn"   onClick={() => {
//                 const slug = contestant.name.toLowerCase().replace(/\s+/g, "-"); // convert "John Doe" → "john-doe"  
//                 navigate(`/vote-for/${slug}`);
//               }}>Vote Now $200</button>
//               }
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Contestants;




















