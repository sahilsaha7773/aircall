import React, { useState, useEffect } from "react";
import styles from "./style.css";
import Activity from "../common/Activity/index.jsx";
import {
  MdOutlineCallMissedOutgoing,
  MdOutlineCallMissed,
} from "react-icons/md";
import { SlCallIn, SlCallOut } from "react-icons/sl";
import { LuArchive } from "react-icons/lu";
import ActivityDetailsModal from "../ActivityDetailsModal/index.jsx";
import { MoonLoader } from "react-spinners";
import { IoTrashBinOutline } from "react-icons/io5";

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [showActivityDetailsModal, setShowActivityDetailsModal] =
    useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const fetchActivities = () => {
    setActivities([]);
    setIsLoading(true);
    setLoadingText("Fetching calls...");
    fetch("https://cerulean-marlin-wig.cyclic.app/activities")
      .then((response) => response.json())
      .then((data) => {
        data.reverse();
        const filteredData = data.filter((activity) => {
          return !activity.is_archived && activity.from && activity.to;
        });
        setActivities(filteredData);
        setIsLoading(false);
      });
  };
  const archiveAllCalls = () => {
    setActivities([]);
    setIsLoading(true);
    setLoadingText("Archiving all calls...");
    const promises = [];
    for (let i = 0; i < activities.length; i++) {
      promises.push(
        fetch(
          `https://cerulean-marlin-wig.cyclic.app/activities/${activities[i].id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_archived: true,
            }),
          }
        )
      );
    }
    Promise.all(promises).then((responses) => {
      console.log(responses);
      fetchActivities();
      setIsLoading(false);
    });
  };
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="activityListWrapper">
      {showActivityDetailsModal && (
        <div>
          <ActivityDetailsModal
            activity={selectedActivity}
            onClose={() => {
              setShowActivityDetailsModal(false);
            }}
            updateActivities={fetchActivities}
          />
        </div>
      )}

      {activities.length > 0 ? (
        <div
          className="archiveButton"
          onClick={() => {
            archiveAllCalls();
          }}
        >
          <LuArchive className="archiveIcon" />
          Archive all calls
        </div>
      ) : null}
      {isLoading ? (
        <div className="loader">
          <MoonLoader loading={isLoading} size={50} />
          <div className="loadingText">{loadingText}</div>
        </div>
      ) : null}
      {!isLoading && activities.length === 0 && (
        <div className="noCalls">
          <IoTrashBinOutline className="noCallsIcon" />
          <div className="noCallsTitle">No calls found</div>
        </div>
      )}
      {activities.map((activity, index) => (
        <div key={activity.id} className={styles.datee}>
          {index === 0 ? (
            <div key={activity.id} className="date">
              <span>{new Date(activity.created_at).toDateString()}</span>
            </div>
          ) : (
            index > 0 &&
            new Date(activities[index - 1].created_at).toDateString() !==
              new Date(activity.created_at).toDateString() && (
              <div key={activity.id} className="date">
                <span>{new Date(activity.created_at).toDateString()}</span>
              </div>
            )
          )}
          <div
            className="activity"
            onClick={() => {
              setSelectedActivity(activity);
              setShowActivityDetailsModal(true);
            }}
          >
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
            {/* {activity.direction === "outbound" ? (
              <div className="number">{activity.to}</div>
            ) : (
              <div className="number">{activity.from}</div>
            )} */}
            <div className="details">
              <div className="">
                <div className="from">
                  {activity.from ? activity.from : activity.via}
                </div>
                <div className="to">
                  {activity.call_type === "missed"
                    ? "tried to call on"
                    : "called on"}{" "}
                  {activity.to}
                </div>
              </div>
              <div className="time">
                {new Date(activity.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  // hourCycle: "h12",
                  // timeStyle: "short",
                })}
              </div>
            </div>
          </div>
          {/* <Activity activity={activity} /> */}
        </div>
      ))}
    </div>
  );
};

export default ActivitiesList;
