import React, { Component } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Users from "../Services/users";
import { Link } from "react-router-dom";
import Footer from './footer'

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead:["S.No","User_ID","Website","Master","Winnings","Credit_Limits","Exposure","Balance","M.comm","S.comm","View More"],
      Cpwd:'',
      msgBox:'none',
      Npwd:'',
      notEqualMsg:"",
      eqlOrNot:'',
      confirm_password:'',
      newPassword:'',
      data: "",
      redirectToReferrer: false,
      newPassword: "",
      confirm_password: "",
      username: "",
      usermasterName: "",
      selecteduser: "",
      useraction: "",
      userdetails: "",
      newParentChip: "",
      newCurrChip: "",
      isDeposit: false,
      Chips: "",
      masterDetails: "",
      userInfo: "",
      Name: "",
      max_stake: "",
      min_stake: "",
      max_profit: "",
      max_loss: "",
      PIP: "",
      PIS: "",
      min_odds: "",
      max_odds: "",
      parentdetails: "",
      searchFilter: [],
      totalBalance: 0,
    };
    this.users = new Users();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
    if (this.state.isDeposit) {
      if (!isNaN(this.state.masterDetails)) {
        this.state.masterDetails = this.state.parentdetails;
      }
      this.setState({
        newParentChip:this.state.masterDetails.walletBalance - parseInt(event.target.value),
        newCurrChip:this.state.userdetails.walletBalance + parseInt(event.target.value),
      })
    } 
    else {
      if (!isNaN(this.state.masterDetails)) {
        this.state.masterDetails = this.state.parentdetails;
      }
      this.setState({
        newParentChip:this.state.masterDetails.walletBalance + parseInt(event.target.value),
        newCurrChip:this.state.userdetails.walletBalance - parseInt(event.target.value),
      })
    }
  }

  handleSearch = (e) => {
    let dataArray = [...this.state.searchFilter];
    let searchUser = e.target.value.toUpperCase();
    const updateList = dataArray.filter((user) => user.userName.toUpperCase().includes(searchUser))
    this.setState({ 
      data: updateList 
    })
  };

  componentDidMount() {
    if(this.props.match.params.username || JSON.parse(localStorage.getItem("data")).Master) {
      this.users.getUsersforMaster(this.props.match.params.username, (data) => {
        this.setState({
          data: data.data,
          searchFilter: data.data,
        });
        let totalBalance = 0;
        this.state.data.map((ele) => totalBalance += ele.walletBalance);
        this.setState({ 
          totalBalance 
        });
      });
      const obj = {
        userName: this.props.match.params.username? this.props.match.params.username: JSON.parse(localStorage.getItem("data")).userName,
      }
      this.users.getMyprofile(obj,(data) => {
        this.setState({
          masterDetails: data.data,
        })
      });
    } 
    else {
      this.users.getAllusers((data) => {
        this.setState({
          data: data.data,
          searchFilter: data.data,
        });
        let totalBalance = 0;
        this.state.data.map((ele) => totalBalance += ele.walletBalance);
        this.setState({ 
          totalBalance 
        });
      });
    }
  }

  view_change_passs = (userdetails) => {
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
    });
    document.getElementById("userpasswordpopup").classList.add("in");
    document.getElementById("userpasswordpopup").style.display = "block";
  }

  update_free_chips = () => {
    if (this.state.isDeposit) {
      const obj = {
        userid: this.state.userdetails.id, 
        fillAmount: this.state.Chips 
      }
      this.users.creditbyUser(obj,"creditAmountByMaster",(Data) => {
        const obj1 = {
          userName: JSON.parse(localStorage.getItem("data")).userName
        }
          this.users.getMyprofile(obj1,(data) => {
              this.setState({
                notifyMsg: Data.data.message
              });
              setTimeout(()=>{
                localStorage.setItem("data", JSON.stringify(data.data));
                window.location.reload();
              },1000)
            }
          );
        });
    } 
    else {
      const obj = {
        userid: this.state.userdetails.id, 
        fillAmount: this.state.Chips
      }
      this.users.debitbyUser(obj,"debitAmountByMaster",(Data) => {
        const obj1 = {
          userName: JSON.parse(localStorage.getItem("data")).userName 
        }
          this.users.getMyprofile(obj1,(data) => {
              this.setState({
                notifyMsg:Data.data.message
              });
              setTimeout(()=>{
                localStorage.setItem("data", JSON.stringify(data.data));
                window.location.reload();
              },1000)
            }
          );
        }
      );
    }
  }

  openChipDeposit = (userdetails) => {
    const obj = { 
      userName: userdetails.master 
    }
    this.users.getMyprofile(obj, (data) => {
      this.setState({
        parentdetails: data.data,
      });
    });
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
      isDeposit: true,
    });
    document.getElementById("chipdeposit").classList.add("in");
    document.getElementById("chipdeposit").style.display = "block";
  }

  openChipWithdrawal = (userdetails) => {
    this.users.getMyprofile({ userName: userdetails.master }, (data) => {
      this.setState({
        parentdetails: data.data,
      });
    });
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
      isDeposit: false,
    });
    document.getElementById("chipwithdrawal").classList.add("in");
    document.getElementById("chipwithdrawal").style.display = "block";
  }

  closePasswordpopup = () => {
    document.getElementById("userpasswordpopup").style.display = "none";
    document.getElementById("userpasswordpopup").classList.remove("in");
  }

  closechipDepositpopup = () => {
    document.getElementById("chipdeposit").style.display = "none";
    document.getElementById("chipdeposit").classList.remove("in");
    this.setState({
      newParentChip: "",
      newCurrChip: "",
    })
  }

  closechipWithdrawalpopup = () =>{
    document.getElementById("chipwithdrawal").style.display = "none";
    document.getElementById("chipwithdrawal").classList.remove("in");
    this.setState({
      newParentChip: "",
      newCurrChip: "",
    })
  }

  hasNumber = (num) => {
    return /\d/.test(num);
  };

  lowerCaseLetters = (char) => {
    var lowerCaseLetters = /[a-z]/g;
    if (char.match(lowerCaseLetters)) {
      return false;
    } 
    else {
      return true;
    }
  };

  upperCaseLetters = (char) => {
    let upperCaseLetters = /[A-Z]/g;
    if (char.match(upperCaseLetters)) {
      return false;
    } 
    else {
      return true;
    }
  };

  validateChangePassword = async () => {

///////////////////////////// validation for newPassword //////////////////////////////////

    if (this.state.newPassword !== "") {
      if (this.state.newPassword.length >= 8) {
        let char = this.state.newPassword[0];
        let chU = this.upperCaseLetters(char);
        if (chU) {
          await this.setState({
            reqNewPwd: "1st letter capital & length must be 8",
            Npwd: false,
          });
        } else {
          await this.setState({
            Npwd: true,
            reqNewPwd: "",
          });
        }
      } else {
        await this.setState({
          reqNewPwd: "Password must have at least 8 character !",
          Npwd: false,
        });
      }
    } else {
      await this.setState({
        reqNewPwd: "This fields is required !",
        Npwd: false,
      });
    }

/////////////////////////////////// validation for confirm_password ////////////////////////////////

    if (this.state.confirm_password !== "") {
      if (this.state.confirm_password.length >= 8) {
        let char = this.state.confirm_password[0];
        let chU = this.upperCaseLetters(char);
        if (chU) {
          await this.setState({
            reqConfirmPwd: "1st letter capital & length must be 8",
            Cpwd: false,
          });
        } else {
          await this.setState({
            Cpwd: true,
            reqConfirmPwd: "",
          });
        }
      } else {
        await this.setState({
          reqConfirmPwd: "Password must have at least 8 character !",
          Cpwd: false,
        });
      }
    } else {
      await this.setState({
        reqConfirmPwd: "This fields is required !",
        Cpwd: false,
      });
    }

    if(this.state.newPassword !== this.state.confirm_password){
      this.setState({
        notEqualMsg:"new password not equal to confirm password",
        eqlOrNot:false
      })
    }else{
      this.setState({
        notEqualMsg:"",
        eqlOrNot:true
      })
    }

    if(this.state.Npwd && this.state.Cpwd && this.state.eqlOrNot){
      return true
    }
    else{
      return false
    }
  }

  savePass = async() => {
    let permitGranted = await this.validateChangePassword();
    if(permitGranted===true){
      if (this.state.username && this.state.confirm_password) {
        const obj = {
          userName: this.state.username,
          password: this.state.confirm_password,
        }
        this.users.changePassword(obj,(data) => {
          document.getElementById("newPassword").value = "";
          document.getElementById("confirm_password").value = "";
          this.setState({
            notifyMsg: data.data.message
          });
          setTimeout(()=>{
            window.location.reload();
          },1000)
        });
      }
    }
  }

  save = () => {
    let path;
    let data = {
      userName: this.state.userName,
      Name: this.state.name,
      password: this.state.password,
      master: JSON.parse(localStorage.getItem("data")).userName,
    };
    this.users.createUser(data, (data) => {
      this.setState({
        notifyMsg: "User Added Successfully"
      });
      setTimeout(()=>{
        window.location.href = path;
      },1000)
    });
  }

  setAction = () => {
    if (this.state.useraction == "mstrlock-0") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockunlock(obj, (data) => {
        this.setState({
          notifyMsg: "User locked successfully",
          msgBox: "block",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    } 
    else if (this.state.useraction == "mstrlock-1") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockunlock(obj, (data) => {
        this.setState({
          notifyMsg: "User unlocked successfully",
          msgBox: "block",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    } 
    else if (this.state.useraction == "lgnusrCloseAc-0") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.closeuser(obj, (data) => {
        this.setState({
          notifyMsg: "User close successfully",
          msgBox: "block",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    }
    else if (this.state.useraction == "lgnusrlckbtng-0") {
      const obj = { 
        userName: this.state.selecteduser 
      }
      this.users.lockingUnlockingBetting(obj,(data) => {
          this.setState({
            notifyMsg: "Betting locked successfully",
            msgBox: "block",
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    } 
    else if (this.state.useraction == "lgnusrlckbtng-1") {
      const obj = { 
        userName: this.state.selecteduser 
      }
      this.users.lockingUnlockingBetting(obj,(data) => {
        this.setState({
          notifyMsg: "Betting unlocked successfully",
          msgBox: "block",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    }
  }

  view_account = (user) => {
    this.setState({
      userdetails: user,
    })
    document.getElementById("viewinfo").classList.add("in");
    document.getElementById("viewinfo").style.display = "block";
    const obj = {
      id: this.state.userdetails.id 
    }
    this.users.userSportsInfo(obj,(data) => {
      this.setState({
        userInfo: data.data,
      });
    });
  }

  submit_info = () => {
    const obj = {
      id: this.state.userdetails.id,
      cricketmaxStacks: this.state.max_stake,
      cricketminStacks: this.state.min_stake,
      cricketmaxProfit: this.state.max_profit,
      cricketmaxLoss: this.state.max_loss,
      cricketPreInplayProfit: this.state.PIP,
      cricketPreInplayStack: this.state.PIS,
      cricketmaxOdds: this.state.max_odds,
      cricketminOdds: this.state.min_odds,
    }
    this.users.updateUserSportsInfo(obj,(data) => {
      alert("updated");
    });
  }

  submit_userInfo() {
    const obj = { 
      userName: this.state.userdetails.userName, 
      Name: this.state.Name 
    }
    this.users.updateMyprofile(obj,(data) => {
      alert("updated");
    });
  }

  closeviewinfo = () => {
    document.getElementById("viewinfo").style.display = "none";
    document.getElementById("viewinfo").classList.remove("in");
  }

  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="forModal" />
        <div className="container body">
          <div className="main_container" id="sticky">
            <div id="userModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content"></div>
              </div>
            </div>

{
  ////////////////////////////////////// NOTIFY BOX /////////////////////////////////
}

            <div className="error-box" style={{ border: "5px solid #fff", width: "30rem", height: "110px", textAlign: "center", color: "#fff", position: "absolute", left: "42%", top: "4%", zIndex: "100", display: this.state.msgBox, backgroundColor: "green" /*"#d63031"*/, }} >
              <div className="error-head" style={{ padding: "3px 0" }}>
                <h2>SUCCESS</h2>
              </div>
              <div className="error-mess" style={{ padding: "5px 0" }}>
                <h6>{this.state.notifyMsg}</h6>
              </div>
            </div>

{
  ////////////////////////////////////// USER HEADER /////////////////////////////////
}

            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">
                  <span className="lable-user-name">Users Listing</span>
                  <select className="user-select" style={{ color: "black" }}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="userList" />
                  <div className="usersech user-mobile" id="formSubmit"  method="post" >
                    <input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" />
                    <input type="hidden" name="getUserType" id="getUserType" defaultValue={4} />
                    <input type="hidden" name="parentID" id="parentID" defaultValue />
                    <input type="hidden" name="formSubmit" defaultValue={1} />
                    <input type="hidden" name="perpage" id="perpage" />
                    <input type="text" name="mstruserid" id="myInput" style={{ marginLeft: "5px" }} onChange={this.handleSearch} placeholder="Search here" autoComplete="off" />
                  </div>
                  <select className="user-mobile custom-user-select" name="useraction" id="useraction" onChange={this.handleChange} style={{ color: "black",margin:'2px' }} >
                    <option value>Select Action</option>
                    <option value="lgnusrlckbtng-0">Lock Betting</option>
                    <option value="lgnusrlckbtng-1">Open Betting</option>
                    <option value="mstrlock-0">Lock User</option>
                    <option value="mstrlock-1">Unlock User</option>
                    <option value="lgnusrCloseAc-0">Close User Account</option>
                  </select>
                  <button className="btn btn-warning btn-xs" onClick={this.setAction} style={{ padding: "5px", margin: "2px" }} >
                    ACTION
                  </button>
                  {
                    JSON.parse(localStorage.getItem('data')).Master ?
                    <button className="btn btn-warning btn-xs" data-toggle="modal" data-target="#exampleModal" style={{ padding: "4px 5px" }} >
                      ADD USER 
                    </button> :null 
                  }	
                  <button className="btn btn-warning btn-xs" onClick={()=>{this.props.history.goBack()}} style={{ padding: "5px", marginTop: "2px" }} >
                    Back
                  </button>

{
  ////////////////////////////////////// MODAL FOR ADD USER /////////////////////////////////
}

                  <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Add User
                          </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                        <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
                          <div className="row">
                            <div className="col-md-4 col-xs-6">
                              <label> Name</label>
                              <input type="text" name="name" required onChange={this.handleChange} className="form-control" id="left_master_name" autoComplete="off" />
                              <span id="left_master_nameN" className="errmsg" ></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Registration Data </label>
                              <input type="text" name="FromDate" className="form-control" id="Fleft_romDate" autoComplete="off" defaultValue={"2020-07-14"} readOnly="" />
                              <span id="left_FromDateN" className="errmsg"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> User ID </label>
                              <input type="text" required name="userName" onChange={this.handleChange} className="form-control" id="left_username" />
                              <span id="left_usernameN"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Password</label>
                              <input type="password" required name="password" onChange={this.handleChange} className="form-control" id="left_password" autoComplete="off" />
                              <span id="left_passwordN" className="errmsg"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label id="partnerMAx">Partnership [ 0]</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnership"></span>
                              <input type="number" required name="partner" className="form-control" id="left_partner" max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerN" className="errmsg"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label id="partnershipCasino">partnership Casino [ 0]</label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipCasino"></span>
                              <input type="number" name="partnershipCasino" className="form-control" id="left_partnershipCasino" max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerCasinoN" className="errmsg" ></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label id="partnershipLiveTennPatti">Partnership TeenPatti [0]</label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipLiveTennPatti"></span>
                              <input type="number" required name="partnershipLiveTennPatti" className="form-control" id="left_partnershipLiveTennPatti"  max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerLiveTennPattiN" className="errmsg"></span>
                            </div>
                            <div className="col-md-12 col-xs-6 modal-footer">
                              <button type="button" className="blue_button Addsuper1" onClick={this.save} id="child_player_add" >
                                Add
                              </button>
                              <button data-dismiss="modal" type="button" className="red_button" >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

{
  ////////////////////////////////////// TABLE FOR CHANGE PASSWORD /////////////////////////////////
}

              <div className="clearfix" />
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading" />
                  <div className="custom-scroll appendAjaxTbl">
                    <table className="table table-striped jambo_table bulk_action" id="myTable" >
                      <thead>
                        <tr className="headings">
                          {
                            this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.data.length > 0 ?
                            this.state.data.map((item,index) => {
                              return (
                                <tr key={index} id="user_row_152262">
                                  <td>{index+1}
                                    <input type="checkbox" name="selecteduser" onChange={this.handleChange} value={item.userName} className="select-users" />
                                  </td>
                                  <td className="text-center" style={{ paddingBottom: "0px" }}>
                                    <span className="m-bg">{item.userName} &nbsp;
                                      {item.status ? 
                                      <i className="fa fa-user fa_custom fa-2x" title="locked" aria-hidden="true" style={{ color: "red" }}/> : ""}
                                      {item.enableBetting ? 
                                      <i className="fa fa-lock fa_custom fa-2x" title="Betting Locked" aria-hidden="true" style={{ color: "red" }} ></i> : "" }
                                    </span>
                                  </td>
                                  <td className="text-center">BETFUN360</td>
                                  <td className="text-center">{item.master}</td> 
                                  <td className="text-center">{item.profitLossChips}</td>
                                  <td className="text-center">{item.freeChips}</td>
                                  <td className="text-center">
                                    <Link to="#" className="btn btn-success btn-xs">{item.exposure}</Link>
                                  </td>
                                  <td className="text-center">{item.walletBalance} </td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="last">
                                    <span className="dropdown">
                                      <Link to="#" className="dropdown-toggle btn btn-xs btn-success" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" >
                                        View More <span className="caret" />
                                      </Link>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <Link to={"/cacstatement/" + item.userName}>Statement</Link>
                                        </li>
                                        <li>
                                          <Link to={"/profitloss/" + item.userName}>Profit Loss</Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="View Account Info" onClick={() => this.view_account(item)} >
                                            <span>View Info</span>
                                          </Link>
                                        </li>
                                        <li>
                                          
                                          <Link to="#" title="Change Password" onClick={() => this.view_change_passs(item)} >
                                            <span>Change Password</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="Free Chip In Out" onClick={() => this.openChipDeposit(item)} >
                                            <span>Free Chip Deposit</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="Free Chip In Out" onClick={() => this.openChipWithdrawal(item)} >
                                            <span>Free Chip Withdrawal</span>
                                          </Link>
                                        </li>
                                      </ul>
                                    </span>
                                  </td>
                                </tr>
                              );
                            }):
                          null
                        }
                        <tr>
                          <td colSpan={11} className="text-center">Total Balance:{this.state.totalBalance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

{
  ////////////////////////////////////// MODAL FOR CHANGE PASSWORD /////////////////////////////////
}

            <div id="userpasswordpopup" className="modal fade" role="dialog">
              <div className=" " id="changeUserPassword" role="main">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" onClick={this.closePasswordpopup} data-dismiss="modal" >×</button>
                      <h4 className="modal-title">Change Password</h4>
                    </div>
                    <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
                    <div className="modal-body">
                      <div id="PassUserMsg"></div>
                      <div className="row">
                        <form id="ChangePassword" method="post" autoComplete="off" >
                          <input type="hidden" name="compute" defaultValue="e34250a537dafd7d93f9f0827c207d74" />
                          <span id="msg_error"></span><span id="errmsg"></span>
                          <input type="hidden" name="userId" defaultValue="155374" />
                          <div className="col-md-6 col-xs-6">
                            <label>New Password</label>
                            <input type="password" name="newPassword" className="form-control" onChange={this.handleChange} id="newPassword" autoComplete="off" />
                            <span id="newPasswordN" className="errmsg">{this.state.reqNewPwd ? "*"+this.state.reqNewPwd : null}</span>
                          </div>
                          <div className="col-md-6 col-xs-6">
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" className="form-control" onChange={this.handleChange} id="confirm_password" autoComplete="off" />
                            <span id="confirm_passwordN" className="errmsg">{this.state.reqConfirmPwd ? "*"+this.state.reqConfirmPwd : null}</span>
                          </div>
                          <span style={{marginLeft:'20px ', color:'red'}}>
                            {this.state.notEqualMsg ? "*"+this.state.notEqualMsg : null}
                          </span>
                          <div className="col-md-12 col-xs-6 modal-footer">
                            <button type="button" className="blue_button" onClick={this.savePass} id="change_pass" > Change </button>
                            <button data-dismiss="modal" onClick={this.closePasswordpopup} type="button" className="red_button" >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{
  //////////////////////////////////// MODAL FOR CHIP DEPOSIT ////////////////////////////////////////////
}

            <div id="chipdeposit" className="modal fade in" role="dialog" style={{ display: "none" }} >
              <div id="changeUserPassword" role="main">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" onClick={this.closechipDepositpopup}>×</button>
                      <h4 className="modal-title">
                        <span id="tital_change">Free Chips In/Out {this.state.username}</span>
                      </h4>
                    </div>
                    <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
                    <div className="modal-body">
                      <div className="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <span id="msg_error"></span><span id="errmsg"></span>
                          <div className="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" className="form-control" onChange={this.handleChange} required="" />
                            <span id="ChipsN" className="errmsg"></span>
                          </div>
                          <div className="col-md-12">
                            <div className="tabel_content ">
                              <table className="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td className="font-bold">{this.state.masterDetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td className="font-bold">{this.state.userdetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td><span id="ParantNewFreeChips">{this.state.newParentChip}</span></td>
                                  </tr>
                                  <tr>
                                    <td>{this.state.username} New Free Chips</td>
                                    <td><span id="myNewFreeChips">{this.state.newCurrChip}</span></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-md-12 modal-footer">
                            <button type="button" className="btn btn-success pull-right chip-inout-button" onClick={this.update_free_chips} >
                              Deposit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{
  /////////////////////////////////// MODAL FOR CHIP WITHDRAWL ///////////////////////////////////
}

            <div id="chipwithdrawal" className="modal fade in" role="dialog" style={{ display: "none" }} >
              <div id="changeUserPassword" role="main">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" onClick={this.closechipWithdrawalpopup} >×</button>
                      <h4 className="modal-title">
                        <span id="tital_change">
                          Free Chips In/Out {this.state.username}
                        </span>
                      </h4>
                    </div>
                    <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
                    <div className="modal-body">
                      <div className="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <span id="msg_error"></span>
                          <span id="errmsg"></span>

                          <div className="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" className="form-control" onChange={this.handleChange} required="" />
                            <span id="ChipsN" className="errmsg"></span>
                          </div>
                          <div className="col-md-12">
                            <div className="tabel_content ">
                              <table className="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td className="font-bold">{this.state.masterDetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td className="font-bold">{this.state.userdetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td><span id="ParantNewFreeChips">{this.state.newParentChip}</span></td>
                                  </tr>
                                  <tr>
                                    <td>{this.state.username} New Free Chips</td>
                                    <td><span id="myNewFreeChips">{this.state.newCurrChip}</span></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-md-12 modal-footer">
                            <button type="button" className="red_button pull-right chip-inout-button" onClick={this.update_free_chips} style={{ background: "red", borderColor: "red" }} >
                              withdrawal
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{
  ///////////////////////////////// MODAL FOR VIEW INFO ///////////////////////////////////////
}

            <div id="viewinfo" className="modal fade" role="dialog" style={{ display: "none" }} >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" onClick={() => this.closeviewinfo()} data-dismiss="modal" >×</button>
                    <h4 className="modal-title">
                      <span id="tital_change">
                        Account of {this.state.userdetails.userName}
                      </span>
                    </h4>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="sub_heading">
                        <span id="tital_change">User </span>
                      </div>
                      <form>
                        <div className="col-md-4 col-xs-6">
                          <label>User ID</label>
                          <input type="text" className="form-control" value={this.state.userdetails.userName} name="userID" readOnly />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label>User Name</label>
                          <input type="text" className="form-control" name="Name" defaultValue={this.state.userdetails.Name} onChange={this.handleChange} />
                        </div>
                        <div className="col-md-4 col-xs-12">
                          <label>Update From General Setting</label>
                          <br />
                          <input type="checkbox" name="usercheck" defaultValue="1" defaultChecked />
                        </div>
                        <div className="col-md-12 col-xs-12 modal-footer">
                          <button type="button" className="blue_button submit_user_setting" onClick={() => this.submit_userInfo()} >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="sub_heading">
                      <span id="tital_change">Cricket </span>
                    </div>
                    <div className="row">
                      <form>
                        <div className="col-md-4 col-xs-6">
                          <label> MIN STAKE</label>
                          <input type="text" name="min_stake" defaultValue={this.state.userInfo.cricketminStacks} onChange={this.handleChange} className="form-control" id="4_min_stake" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> Max STAKE </label>
                          <input type="text" name="max_stake" defaultValue={this.state.userInfo.cricketmaxStacks} onChange={this.handleChange} className="form-control" id="4_max_stake" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> MAX PROFIT </label>
                          <input type="text" name="max_profit" defaultValue={this.state.userInfo.cricketmaxProfit} onChange={this.handleChange} className="form-control" id="4_max_profit" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> Max Loss </label>
                          <input type="text" name="max_loss" defaultValue={this.state.userInfo.cricketmaxLoss} onChange={this.handleChange} className="form-control" id="4_max_loss"
                          />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> PRE INPLAY PROFIT</label>
                          <input type="text" name="PIP" defaultValue={ this.state.userInfo.cricketPreInplayProfit } onChange={this.handleChange} className="form-control" id="4_pre_innplay_profit" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> PRE INPLAY STAKE</label>
                          <input type="text" name="PIS" defaultValue={ this.state.userInfo.cricketPreInplayStack } onChange={this.handleChange} className="form-control" id="4_pre_inplay_stake" />
                        </div>

                        <div className="col-md-4 col-xs-6">
                          <label> MIN ODDS</label>
                          <input type="text" name="min_odds" defaultValue={this.state.userInfo.cricketminOdds} onChange={this.handleChange} className="form-control" id="4_min_odds" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label> MAX ODDS</label>
                          <input type="text" name="max_odds" defaultValue={this.state.userInfo.cricketmaxOdds} onChange={this.handleChange} className="form-control" id="4_max_odds" />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label>UNMATCH BET</label>
                          <input type="checkbox" name="sport[is_unmatch_bet]" />
                          <br />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label>LOCK BET</label>
                          <input type="checkbox" name="sport[lock_bet]" />{" "}
                          <br />
                        </div>
                        <div className="col-md-12 col-xs-12 modal-footer">
                          <button type="button" className="blue_button submit_user_setting" id="update-4-setting" onClick={() => this.submit_info()} >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}
