import "./style";

import * as React from "react";
import UiAvatar from '~/components/UiAvatar'
import PlayerModal from './PlayerModal'

import { useReducer, useEffect, useRef } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'

interface State {
  time: number
  isPlaying: boolean
  isOpen: boolean
}

type Action = ReducerAction<'controls:open'>
  | ReducerAction<'controls:close'>
  | ReducerAction<'controls:seek', { time: number }>
  | ReducerAction<'time-update', { time: number }>
  | ReducerAction<'controls:play'>
  | ReducerAction<'controls:pause'>

const reducer = (state: State, action: Action) => {
  switch(action.type) {
    case 'controls:open': {
      return {
        ...state,
        isOpen: true
      }
    }

    case 'controls:close': {
      return {
        ...state,
        isOpen: false
      }
    }
    
    case 'controls:seek': {
      return {
        ...state,
        time: action.payload.time
      }
    }

    case 'controls:play': {
      return {
        ...state,
        isPlaying: !state.isPlaying
      }
    }

    case 'time-update': {
      return {
        ...state,
        time: action.payload.time
      }
    }
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatchHome(props: ReactComponentWrapper) {
  const context = usePartyContext()

  const [state, dispatch] = useReducer(reducer, {
    time: context.party.current_time,
    isPlaying: false,
    isOpen: false
  })

  const $video = useRef<HTMLVideoElement>()

  useEffect(() => {
    if (state.isPlaying) {
      $video.current.play()
    } else {
      $video.current.pause()
    }
  }, [state.isPlaying])

  function handleOpen() {
    dispatch({
      type: 'controls:open'
    })
  }

  function handleClose() {
    dispatch({
      type: 'controls:close'
    })
  }

  function handleSeek(time: number) {
    dispatch({
      type: 'controls:seek',
      payload: { time }
    })

    $video.current.currentTime = time
  }

  function handlePlay() {
    dispatch({
      type: 'controls:play'
    })
  }

  function handleTimeUpdate() {
    dispatch({
      type: 'time-update',
      payload : { time: $video.current.currentTime }
    })
  }

  return (
    <React.Fragment>
      <PlayerModal party={context.party}
        time={state.time}
        isOpen={state.isOpen}
        isPlaying={state.isPlaying}
        onClose={handleClose}
        onPlay={handlePlay}
        onSeek={handleSeek} />
      
      <div className="watch-screen">
        <div
          className="watch-screen-video"
          style={{
            backgroundImage: `url(${require("~/assets/show-thumbnail-218x146.jpg")})`
          }}
          onClick={handleOpen}
        >
          <video src={context.party.video.video_url} ref={$video}
          onTimeUpdate={handleTimeUpdate}></video>
        </div>

        <div className="watch-screen-chat">
          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">
                  it wasn't that bad if you ask me. it was just weird.
                </div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">what'd you think</div>
              </div>

              <div className="message">
                <div className="inner">did you like it?</div>
              </div>

              <div className="message">
                <div className="inner">hey</div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require("~/assets/dummy-avatar.png")} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">
                  it wasn't that bad if you ask me. it was just weird.
                </div>
              </div>
            </div>
          </div>

          <div className="watch-screen-activity-group">
            <div className="activity">
              <div className="avatar">
                <UiAvatar img={require("~/assets/dummy-avatar.png")} size="sm" />
              </div>

              <h6 className="ui-subheading">Kier left the room.</h6>
            </div>

            <div className="activity">
              <div className="avatar">
                <UiAvatar img={require("~/assets/dummy-avatar.png")} size="sm" />
              </div>

              <h6 className="ui-subheading">Kier joined the room.</h6>
            </div>
          </div>
        </div>

        <div className="watch-screen-chatbar">
          <input
            type="text"
            className="ui-input"
            placeholder="Write something..."
          />
        </div>
      </div>
      {props.children}
    </React.Fragment>
  );
}

export default AppWatchHome;
