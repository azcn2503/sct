import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fsR from 'fs-reverse';
import { setZoneName } from '../actions/plugins';

const scanReverseIds = [];

/**
 * MonitorPlugin will establish a reverse file stream on the log file.
 * There will be one MonitorPlugin component per enabled plugin.
 */
export default function MonitorPlugin(props) {
  const dispatch = useDispatch();
  const plugin = useSelector(state => state.plugins.byId[props.pluginId]);
  const compiled = useSelector(state => state.compiled.byId[props.pluginId]);
  const isScanning = scanReverseIds.includes(props.pluginId);

  // function startReverseScan() {
  //   scanReverseIds.push(plugin.manifest.id);
  //   const stream = fsR(props.logFilePath);
  //   stream.on('data', line => {
  //     compiled.scanReverse({
  //       line,
  //       setZoneName: zoneName => {
  //         stream.destroy();
  //         dispatch(setZoneName({ id: plugin.manifest.id, zoneName }));
  //       }
  //     });
  //   });
  // }

  // Scan the log file in reverse for the zone name using scanReverse from this plugin
  // useEffect(() => {
  //   if (props.plugin.compiled.scanReverse && props.logFilePath && !isScanning) {
  //     startReverseScan();
  //   }
  // }, [props.plugin.compiled.scanReverse, props.logFilePath]);
  return null;
}
