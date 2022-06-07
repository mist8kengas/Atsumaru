import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AppContext } from "../../appContext";
import Carousel, { GenericItem } from "../../components/carousel/Carousel";
import Debug from "../../components/debug/Debug";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import Info from "../../components/info/Info";
import Loading from "../../components/loading/Loading";
import useApi, { apiBase } from "../../hooks/useApi";
import useOnline from "../../hooks/useOnline";
import cm from "../../utils/classMerger";
import classes from "./front.module.scss";

export default function Front() {
  const online = useOnline();
  const [isOnline, setIsOnline] = useState(online);
  const ctx = useContext(AppContext);
  const [loggedIn] = ctx.loggedIn ?? [];
  const { refetch, isLoading, error, data } = useQuery<{
    layout: GenericItem[];
  }>(
    ["front"],
    () =>
      fetch(`${apiBase}/layout/s1/front`, {
        credentials: "include",
      }).then(res => res.json()),
    {
      retry: false,
    },
  );
  useEffect(() => {
    if (!isLoading) {
      if ((online || loggedIn) && !isOnline) {
        refetch();
      }
    }
    if (online !== isOnline) setIsOnline(online);
  }, [online, loggedIn, isOnline]);
  const { slug } = useParams();
  const layout = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div ref={layout} className={cm(classes.front, slug && classes.hidden)}>
        <Debug />
        {online ? (
          isLoading && !data && !error ? (
            <Loading />
          ) : error ? (
            <>
              <Header level={2}>Oops, apologies</Header>
              <p>
                It appears something went critically wrong, please try again in
                a few minutes.
              </p>
              <p>
                Error: <code>{error + ""}</code> (api probably temporarily down)
              </p>
            </>
          ) : data ? (
            data.layout.map(item => <Carousel key={item.key} item={item} />)
          ) : (
            <></>
          )
        ) : (
          <>
            <Header level={1}>
              You are offline <Icon icon="offline" />
            </Header>
            <p>*cricket noises*</p>
          </>
        )}
      </div>
      {/* <div style={{height: "1000px"}}></div> */}
    </>
  );
}
