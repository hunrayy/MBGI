
import './contestants.css'
import { useNavigate } from 'react-router-dom';
import image from "../../../public/testContestantImage.jpeg"
import { useContestants } from './useContestants';




const Contestants = ({ adminDashboard }) => {
  const navigate = useNavigate();
  const { data: contestants, isLoading, isError, error } = useContestants();

  if (isLoading) {
    return (
      <div className="contestants-container" style={{ width: "100%" }}>
        <div className="contestants-flex">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="contestant-card skeleton-card">
              <div className="skeleton-image"></div>
              <div className="contestant-details">
                <div className="skeleton-name"></div>
                <div className="skeleton-number"></div>
                <div className="contestant-divider skeleton-divider"></div>
                <div className="skeleton-vote-box">
                  <div className="skeleton-vote-number"></div>
                  <div className="skeleton-vote-text"></div>
                </div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <p className="alert alert-danger">Failed to load contestants</p>;

  // Create a shallow copy, sort by votes descending, then name ascending
  const sortedContestants = contestants.slice().sort((a, b) => {
    if (b.total_votes !== a.total_votes) return b.total_votes - a.total_votes;
    return a.fullname.localeCompare(b.fullname, undefined, { sensitivity: "base" });
  });

  // Assign ranks considering ties
  let lastVotes = null;
  let lastRank = 0;
  let sameRankCount = 0;

  const rankedContestants = sortedContestants.map((c, index) => {
    if (c.total_votes === lastVotes) {
      sameRankCount += 1;
      c.rank = lastRank;
    } else {
      lastRank = lastRank + 1 + sameRankCount;
      sameRankCount = 0;
      c.rank = lastRank;
      lastVotes = c.total_votes;
    }
    return c;
  });

  return (
    <div className="contestants-container">
      <div className="contestants-flex">
        {rankedContestants.map((contestant) => (
          <div key={contestant.id} className="contestant-card">
            <div className="contestant-image-wrapper">
              <img src={contestant.image || image} alt={contestant.fullname} className="contestant-image" />
            </div>

            {/* Crown based on rank */}
            <div className="landing-page-crown-wrapper">
              <i className="fa fa-crown"></i> #{contestant.rank}
            </div>

            <div className="contestant-details">
              <h3 className={`contestant-name ${adminDashboard ? "name-black" : ""}`}>
                {contestant.fullname}
              </h3>

              <p
                className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`}
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px" }}
              >
                Contestant Number {String(contestant.contestant_number).padStart(2, "0")}
              </p>

              <div className="contestant-divider text-muted"></div>

              <div className="vote-count">
                <span>
                  <span className="display-5 fw-bold text-center">
                    {contestant.total_votes?.toLocaleString() || 0}
                  </span>
                  <br />
                  <span style={{ color: "#ddd" }}>
                    Vote{contestant.total_votes && contestant.total_votes > 1 ? "s" : ""}
                  </span>
                </span>
              </div>

              {!adminDashboard && (
                <button
                  className="vote-btn"
                  onClick={() => {
                    const slug = contestant.fullname.toLowerCase().replace(/\s+/g, "-");
                    navigate(`/vote-for/${slug}/contestant-number/${contestant.contestant_number}`, {
                      state: { contestant },
                    });
                  }}
                >
                  Vote Now ₦100
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contestants;






































// import './contestants.css'
// import { useNavigate } from 'react-router-dom';
// import image from "../../../public/testContestantImage.jpeg"
// import { useContestants } from './useContestants';


// const Contestants = ({adminDashboard}) => {
//   const navigate = useNavigate()  
//   const { data: contestants, isLoading, isError, error } = useContestants();
//   // const { data: contestants,  isError, error } = useContestants();
// // const isLoading = true;
// if (isLoading) {
//   return (
//     <div className="contestants-container" style={{width: "100%"}}>
//       <div className="contestants-flex">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="contestant-card skeleton-card">
//             <div className="skeleton-image"></div>

//             <div className="contestant-details">
//               <div className="skeleton-name"></div>
//               <div className="skeleton-number"></div>
//               <div className="contestant-divider skeleton-divider"></div>

//               <div className="skeleton-vote-box">
//                 <div className="skeleton-vote-number"></div>
//                 <div className="skeleton-vote-text"></div>
//               </div>

//               <div className="skeleton-button"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


//   if (isError) return <p className='alert alert-danger'>Failed to load contestants</p>;

//   return (
//     <div className="contestants-container">
//   <div className="contestants-flex">
//     {contestants
//       .slice() // ✅ create a shallow copy so we don’t mutate React Query cache
//       .sort((a, b) => {
//         // Sort by total_votes descending first
//         if (b.total_votes !== a.total_votes) {
//           return b.total_votes - a.total_votes;
//         }
//         // If votes are equal, sort by fullname alphabetically (case-insensitive)
//         return a.fullname.localeCompare(b.fullname, undefined, { sensitivity: "base" });
//       })
//       .map((contestant) => (
//         <div key={contestant.id} className="contestant-card">
          
//           <div className="contestant-image-wrapper">
//             <img src={contestant.image} alt={contestant.name} className="contestant-image" />
//           </div>

//           <div className='landing-page-crown-wrapper'> 
//               <i className="fa fa-crown"></i> #2
//           </div>
//           <div className="contestant-details">
//             <h3 className={`contestant-name ${adminDashboard ? "name-black" : ""}`}>
//               {contestant.fullname}
//             </h3>

//             <p
//               className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`}
//               style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px" }}
//             >
//               Contestant Number {String(contestant.contestant_number).padStart(2, "0")}
//             </p>

//             <div className="contestant-divider text-muted"></div>

//             <div className="vote-count">
//               <span>
//                 <span className="display-5 fw-bold text-center">
//                   {contestant.total_votes?.toLocaleString() || 0}
//                 </span>
//                 <br />
//                 <span style={{ color: "#ddd" }}>Vote{(contestant.total_votes && contestant.total_votes > 1) && 's' }</span>
//               </span>
//             </div>

//             {!adminDashboard && (
//               <button
//                 className="vote-btn"
//                 onClick={() => {
//                   const slug = contestant.fullname.toLowerCase().replace(/\s+/g, "-");
//                   navigate(`/vote-for/${slug}/contestant-number/${contestant.contestant_number}`, {
//                     state: { contestant },
//                   });
//                 }}
//               >
//                 Vote Now ₦100
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//   </div>
// </div>

//   );
// }

// export default Contestants;
              














































// import './contestants.css'
// import { useNavigate } from 'react-router-dom';
// import image from "../../../public/testContestantImage.jpeg"
// import { useContestants } from './useContestants';


// const Contestants = ({adminDashboard}) => {
//   const navigate = useNavigate()  
//   const { data: contestants, isLoading, isError, error } = useContestants();
//   // const { data: contestants,  isError, error } = useContestants();
// // const isLoading = true;
// if (isLoading) {
//   return (
//     <div className="contestants-container" style={{width: "100%"}}>
//       <div className="contestants-flex">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="contestant-card skeleton-card">
//             <div className="skeleton-image"></div>

//             <div className="contestant-details">
//               <div className="skeleton-name"></div>
//               <div className="skeleton-number"></div>
//               <div className="contestant-divider skeleton-divider"></div>

//               <div className="skeleton-vote-box">
//                 <div className="skeleton-vote-number"></div>
//                 <div className="skeleton-vote-text"></div>
//               </div>

//               <div className="skeleton-button"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


//   if (isError) return <p className='alert alert-danger'>Failed to load contestants</p>;

//   return (
//     <div className="contestants-container">  

//       <div className="contestants-flex">
//         {contestants.map((contestant) => (
//           <div key={contestant.id} className="contestant-card">  
//             <div className="contestant-image-wrapper">
//               <img src={contestant.image} alt={contestant.name} className="contestant-image" />
//             </div>
//             <div className="contestant-details">
//               <h3 className={`contestant-name ${adminDashboard ? "name-black" : ""}`}>{contestant.fullname}</h3>
//               {/* <p className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`}>
//                 Contestant Number {String(contestant.contestant_number).padStart(2, "0")}
//               </p> */}
//               <p className={`contestant-desc ${adminDashboard ? "text-dark" : ""}`} style={{fontFamily: "'Orbitron', sans-serif", fontSize: "20px"}}>
//                 {String(contestant.contestant_number).padStart(2, "0")}
//               </p>

//               {/* <p className={`contestant-desc ${adminDashboard ? "text-muted" : ""}`}>{contestant.bio}</p> */}

//               {/* ✨ Underline Divider */}
//               <div className="contestant-divider text-muted"></div>

//               {/* 🗳️ Vote Count */}
//               <div className="vote-count">
//                 <span><span className="display-5 fw-bold text-center">{contestant.total_votes.toLocaleString()}</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span>
//                 {/* <span><span className="display-5 fw-bold text-center">0</span> <br /> <span style={{color: "#ddd"}}>Votes</span></span> */}
//               </div>

//               {/* 🌟 Vote Button */}
//               {
//               !adminDashboard &&  
//               <button className="vote-btn"   onClick={() => {
//                 const slug = contestant.fullname.toLowerCase().replace(/\s+/g, "-"); // convert "John Doe" → "john-doe"  
//                 navigate(`/vote-for/${slug}/contestant-number/${contestant.contestant_number}`, {state: { contestant }});
//               }}>Vote Now ₦100</button>
//               }
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Contestants;