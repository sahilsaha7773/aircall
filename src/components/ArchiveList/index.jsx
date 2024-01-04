import React, { useState, useEffect, useCallback } from "react";
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

const ArchiveList = () => {
  const [activities, setActivities] = useState([]);
  const [showActivityDetailsModal, setShowActivityDetailsModal] =
    useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const fetchActivities = useCallback(() => {
    setActivities([]);
    setIsLoading(true);
    setLoadingText("Fetching archived calls...");
    fetch("https://cerulean-marlin-wig.cyclic.app/activities")
      .then((response) => response.json())
      .then((data) => {
        data.reverse();
        const filteredData = data.filter((activity) => {
          return activity.is_archived && activity.from && activity.to;
        });
        setActivities(filteredData);
        setIsLoading(false);
      });
  });
  const unarchiveAllCalls = useCallback(() => {
    setActivities([]);
    setIsLoading(true);
    setLoadingText("Unarchiving all calls...");
    fetch("https://cerulean-marlin-wig.cyclic.app/reset", {
      method: "PATCH",
    }).then((response) => {
      fetchActivities();
      setIsLoading(false);
    });
  });
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="activityListWrapper">
      {showActivityDetailsModal && (
        <div>
          <ActivityDetailsModal
            activity={selectedActivity}
            onClose={() => setShowActivityDetailsModal(false)}
            updateActivities={fetchActivities}
          />
        </div>
      )}

      {activities.length > 0 ? (
        <div
          className="archiveButton"
          onClick={() => {
            unarchiveAllCalls();
          }}
        >
          <LuArchive className="archiveIcon" />
          Unarchive all calls
        </div>
      ) : null}
      {isLoading ? (
        <div className="loader">
          <MoonLoader size={50} />
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

export default ArchiveList;
