import React, { useState, useEffect } from "react";
import {
  MdOutlineCallMissedOutgoing,
  MdOutlineCallMissed,
} from "react-icons/md";
import { SlCallIn, SlCallOut } from "react-icons/sl";
import { LuArchive } from "react-icons/lu";
import "./style.css";
const ActivityDetailsModal = ({ activity, onClose, updateActivities }) => {
  const [buttonText, setButtonText] = useState("Archive call");
  useEffect(() => {
    if (activity.is_archived) {
      setButtonText("Unarchive call");
    } else {
      setButtonText("Archive call");
    }
  }, [activity]);

  const onUpdateCall = () => {
    setButtonText("Loading...");
    fetch(`https://cerulean-marlin-wig.cyclic.app/activities/${activity.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ...activity,
        is_archived: !activity.is_archived,
      }),
    })
      .then((response) => {
        // response.json();
        if (response.status === 200) {
          setButtonText("Success");
          updateActivities();
        } else {
          setButtonText("Error");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        onClose();
      });
  };
  return (
    <div
      className="modal"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target.className === "modal") onClose();
      }}
    >
      <div className="modalContent">
        <div className="modalHeader">
          <div className="modalTitle">Call Details</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
        <div className="modalBody">
          <div className="modalBodyContent">
            <div className="modalBodyHeader">
              <div
                className={`callIcon ${
                  activity.call_type === "missed" ? "red" : ""
                }`}
              >
                {activity.call_type === "missed" ? (
                  activity.direction === "outbound" ? (
                    <MdOutlineCallMissedOutgoing />
                  ) : (
                    <MdOutlineCallMissed />
                  )
                ) : activity.direction === "outbound" ? (
                  <SlCallOut />
                ) : (
                  <SlCallIn />
                )}
              </div>
              <div className="modalBodyHeaderDetails">
                {activity.call_type === "missed" ? (
                  activity.direction === "outbound" ? (
                    <div className="modalBodyHeaderDetailsMissed">
                      <div className="modalBodyHeaderDetailsTitle">
                        Outgoing Missed call
                      </div>
                      <div className="modalBodyHeaderDetailsTime">
                        {new Date(activity.created_at).toDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="modalBodyHeaderDetailsMissed">
                      <div className="modalBodyHeaderDetailsTitle">
                        Incoming Missed call
                      </div>
                      <div className="modalBodyHeaderDetailsTime">
                        {new Date(activity.created_at).toDateString()}
                      </div>
                    </div>
                  )
                ) : activity.direction === "outbound" ? (
                  <div className="modalBodyHeaderDetailsMissed">
                    <div className="modalBodyHeaderDetailsTitle">
                      Outgoing call
                    </div>
                    <div className="modalBodyHeaderDetailsTime">
                      {new Date(activity.created_at).toDateString()}
                    </div>
                  </div>
                ) : (
                  <div className="modalBodyHeaderDetailsMissed">
                    <div className="modalBodyHeaderDetailsTitle">
                      Incoming call
                    </div>
                    <div className="modalBodyHeaderDetailsTime">
                      {new Date(activity.created_at).toDateString()}
                    </div>
                  </div>
                )}
                <div claassName="modalBodyHeaderDetailsDuration">
                  {activity.duration} seconds
                </div>
              </div>
            </div>
            <div className="modalInfo">
              <div className="modalInfoItem">
                <div className="modalInfoItemTitle">From</div>
                <div className="modalInfoItemValue">{activity.from}</div>
              </div>
              <div className="modalInfoItem">
                <div className="modalInfoItemTitle">To</div>
                <div className="modalInfoItemValue">{activity.to}</div>
              </div>
              <div className="modalInfoItem">
                <div className="modalInfoItemTitle">Via</div>
                <div className="modalInfoItemValue">{activity.via}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalFooter">
          <div
            className="modalFooterButton"
            onClick={() => {
              onUpdateCall();
            }}
          >
            <div className="modalFooterButtonArchive">
              <LuArchive className="modalFooterButtonArchiveIcon" />
              {buttonText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
