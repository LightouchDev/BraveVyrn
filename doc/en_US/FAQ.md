# FAQ

* Black screen on Windows 10 / can't broadcasting
  * Solution 1: Active "Disable Hardware Acceleration" in option and restart program.
    * **NOTE**: May cause animation huge delay.

  * Solution 2: Right click on shortcut and click "Properties", set "Compatibility mode" to "Windows 8".
    * **NOTE**: May increase 50% memory usage.

  * Solution 3: Right click on shortcut and click "Properties", append the one of argument below to "Target" field.
    * **NOTE**: no guarantee for these arguments would work.
    * `--disable-direct-composition`
    * `--disable-gpu-compositing`
    * `--disable-d3d11`
