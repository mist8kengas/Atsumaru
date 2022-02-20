import React, { useEffect } from "react";
import useRipple from "use-ripple-hook";
import useImage from "../../hooks/useImage";
import { MangaInfo } from "../../types";
import classes from "./poster.module.scss";

type Props = {
    manga?: MangaInfo;
    label?: string;
};

export default function Poster({ manga, label }: Props) {
    const [ripple, event] = useRipple();
    const {
        src: image,
        loading,
        fail,
        retry,
    } = useImage([manga?.cover], "https://i.imgur.com/SIyOAeP.png");

    useEffect(() => {
        retry();
    }, [manga]);

    return (
        <>
            <button className={classes.poster} onMouseDown={event}>
                <div
                    ref={ripple}
                    className={classes.posterImage}
                    style={{
                        backgroundImage: `url("${image}")`,
                    }}
                >
                    {loading && <div className={classes.loader}></div>}
                </div>
                <div className={classes.label}>{label}</div>
            </button>
        </>
    );
}
