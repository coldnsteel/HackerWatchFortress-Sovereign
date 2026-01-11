# HackerWatchFortress-Sovereign
Sovereign Security Dashboard - No Government Ties
# HackerWatchFortress-Sovereign v3.0 - E.I. Container Edition

Sovereign air-gapped observability for embodied intelligence (E.I.) dev—local/read-only, no gov/cloud ties. Multi-stage Docker for ROS 2 integration (DDS introspect, no actuation).

## Quick Start (Local Computer)
1. Clone repo:
   git clone https://github.com/coldnsteel/HackerWatchFortress-Sovereign.git
   cd HackerWatchFortress-Sovereign

2. Build/Run:
   docker build -t sovereign-ei:dev .
   docker-compose up -d

3. Access: http://localhost:3000 (loopback only)
4. Test DDS: docker exec -it ros2-observer ros2 topic echo /scan
5. Shutdown: docker-compose down

## Threat Model (STRIDE-Lite)
- Spoofing: DDS passive, SROS keys mitigate.
- Tampering: Non-root, read-only.
- Repudiation: Local timestamped logs.
- Disclosure: Internal net, no outbound.
- Denial: Resource alert-only.
- Elevation: Container isolation.

Contact: lexalytics@yahoo.com
Emmanuel - God With Us
