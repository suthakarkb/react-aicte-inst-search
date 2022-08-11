const aictehost = 'https://aslapapi.aicte-india.org';

export default {
  "getStates": aictehost+"/api/getRegisterState",
  "getDistricts": aictehost+"/api/getDistrictByMultiStates?states=",
  "getInstituteDetails": aictehost+"/api/getParakhInstituteDetails"
}
