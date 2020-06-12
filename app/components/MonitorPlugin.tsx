import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import fsR from 'fs-reverse';
import { setZoneName } from '../actions/plugins';

const scanReverseIds = [];

/**
 * MonitorPlugin will establish a reverse file stream on the log file.
 * There will be one MonitorPlugin component per enabled plugin.
 */
export default function MonitorPlugin(props) {
  const dispatch = useDispatch();
  const isScanning = scanReverseIds.includes(props.plugin.manifest.id);

  function startReverseScan() {
    scanReverseIds.push(props.plugin.manifest.id);
    const stream = fsR(props.logFilePath);
    stream.on('data', line => {
      props.plugin.compiled.scanReverse({
        line,
        setZoneName: zoneName => {
          stream.destroy();
          dispatch(setZoneName({ id: props.plugin.manifest.id, zoneName }));
        }
      });
    });
  }

  // Scan the log file in reverse for the zone name using scanReverse from this plugin
  useEffect(() => {
    if (props.plugin.compiled.scanReverse && props.logFilePath && !isScanning) {
      startReverseScan();
    }
  }, [props.plugin.compiled.scanReverse, props.logFilePath]);
  return null;
}
