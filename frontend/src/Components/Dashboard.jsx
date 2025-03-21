import React from 'react'

function Dashboard() {
<<<<<<< HEAD
  return (
    <div>Dashboard</div>
  )
=======
    return (
        <div>
            <section id="content" className="content">
                <div className="content__header content__boxed overlapping">
                    <div className="content__wrap">
                        <h1 className="page-title mb-2">Dashboard</h1>
                        <h2 className="h5">Welcome back to the Dashboard.</h2>
                        <p>Scroll down to see quick links and overviews of your Server, To do list<br /> Order status or get some Help using Nifty.</p>
                    </div>
                </div>

                <div className="content__boxed">
                    <div className="content__wrap">
                        <div className="row">
                            <div className="col-xl-7 mb-3 mb-xl-0">
                                <div className="card h-100">
                                    <div className="card-header d-flex align-items-center border-0">
                                        <div className="me-auto">
                                            <h3 className="h4 m-0">Network</h3>
                                        </div>
                                        <div className="toolbar-end">
                                            <button type="button" className="btn btn-icon btn-sm btn-hover btn-light" aria-label="Refresh Network Chart">
                                                <i className="demo-pli-repeat-2 fs-5"></i>
                                            </button>
                                            <div className="dropdown">
                                                <button className="btn btn-icon btn-sm btn-hover btn-light" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Network dropdown">
                                                    <i className="demo-pli-dot-horizontal fs-4"></i>
                                                    <span className="visually-hidden">Toggle Dropdown</span>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <a href="#" className="dropdown-item">
                                                            <i className="demo-pli-pen-5 fs-5 me-2"></i> Edit Date
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="dropdown-item">
                                                            <i className="demo-pli-refresh fs-5 me-2"></i> Refresh
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>
                                                    <li>
                                                        <a href="#" className="dropdown-item">
                                                            <i className="demo-pli-file-csv fs-5 me-2"></i> Save as CSV
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="dropdown-item">
                                                            <i className="demo-pli-calendar-4 fs-5 me-2"></i> View Details
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body py-0" style={{ height: '250px', maxHeight: '275px' }}>
                                        <canvas id="_dm-networkChart"></canvas>
                                    </div>

                                    <div className="card-body mt-4">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h4 className="h5 mb-3">CPU Temperature</h4>
                                                <div className="row">
                                                    <div className="col-5">
                                                        <div className="h5 display-6 fw-normal">
                                                            43.7 <span className="fw-bold fs-5 align-top">°C</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-7 text-sm">
                                                        <div className="d-flex justify-content-between align-items-start px-3 mb-3">
                                                            Min Values
                                                            <span className="d-block badge bg-success ms-auto">27°</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-start px-3">
                                                            Max Values
                                                            <span className="d-block badge bg-danger ms-auto">89°</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h5>Today Tips</h5>
                                                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <h4 className="h5 mb-3">Bandwidth Usage</h4>
                                                <div className="h2 fw-normal">
                                                    754.9<span className="ms-2 fs-6 align-top">Mbps</span>
                                                </div>

                                                <div className="mt-4 mb-2 d-flex justify-content-between">
                                                    <span className="">Income</span>
                                                    <span className="">70%</span>
                                                </div>
                                                <div className="progress progress-md">
                                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-label="Incoming Progress" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>

                                                <div className="mt-4 mb-2 d-flex justify-content-between">
                                                    <span className="">Outcome</span>
                                                    <span className="">10%</span>
                                                </div>
                                                <div className="progress progress-md">
                                                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '10%' }} aria-label="Outcome Progress" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-5">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="card bg-success text-white overflow-hidden mb-3">
                                            <div className="p-3 pb-2">
                                                <h5 className="mb-3"><i className="demo-psi-data-storage text-reset text-opacity-75 fs-3 me-2"></i> HDD Usage</h5>
                                                <ul className="list-group list-group-borderless">
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Free Space</div>
                                                        <span className="fw-bold">132Gb</span>
                                                    </li>
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Used space</div>
                                                        <span className="fw-bold">1,45Gb</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="py-0" style={{ height: '70px', margin: '0 -5px -5px' }}>
                                                <canvas id="_dm-hddChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="card bg-info text-white overflow-hidden mb-3">
                                            <div className="p-3 pb-2">
                                                <h5 className="mb-3"><i className="demo-psi-coin text-reset text-opacity-75 fs-2 me-2"></i> Earning</h5>
                                                <ul className="list-group list-group-borderless">
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Today</div>
                                                        <span className="fw-bold">$764</span>
                                                    </li>
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Last 7 Day</div>
                                                        <span className="fw-bold">$1,332</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="py-0" style={{ height: '70px', margin: '0 -5px -5px' }}>
                                                <canvas id="_dm-earningChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="card bg-purple text-white overflow-hidden mb-3">
                                            <div className="p-3 pb-2">
                                                <h5 className="mb-3"><i className="demo-psi-basket-coins text-reset text-opacity-75 fs-2 me-2"></i> Sales</h5>
                                                <ul className="list-group list-group-borderless">
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Today</div>
                                                        <span className="fw-bold">$764</span>
                                                    </li>
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Last 7 Day</div>
                                                        <span className="fw-bold">$1,332</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="py-0" style={{ height: '70px' }}>
                                                <canvas id="_dm-salesChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="card bg-warning text-white overflow-hidden mb-3">
                                            <div className="p-3 pb-2">
                                                <h5 className="mb-3"><i className="demo-psi-basket-coins text-reset text-opacity-75 fs-2 me-2"></i> Progress</h5>
                                                <ul className="list-group list-group-borderless">
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Completed</div>
                                                        <span className="fw-bold">34</span>
                                                    </li>
                                                    <li className="list-group-item p-0 text-reset d-flex justify-content-between align-items-start">
                                                        <div className="me-auto">Total</div>
                                                        <span className="fw-bold">79</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="py-0 pb-2" style={{ height: '70px' }}>
                                                <canvas id="_dm-taskChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 p-3">
                                                <div className="h3 display-3">95</div>
                                                <span className="h6">New Friends</span>
                                            </div>
                                            <div className="flex-grow-1 text-center ms-3">
                                                <p className="text-body-secondary">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
                                                <button className="btn btn-sm btn-danger">View Details</button>

                                                <div className="mt-4 pt-3 d-flex justify-content-around border-top">
                                                    <div className="text-center">
                                                        <h4 className="mb-1">1,345</h4>
                                                        <small className="text-body-secondary">Following</small>
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="mb-1">23k</h4>
                                                        <small className="text-body-secondary">Followers</small>
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="mb-1">278</h4>
                                                        <small className="text-body-secondary">Posts</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-body-secondary bg-opacity-50 my-3 pt-3">
                    <div className="content__boxed">
                        <div className="content__wrap">
                            <div className="row gx-5 gy-5 gy-md-0">
                                <div className="col-md-4">
                                    <h4 className="mb-3">To-do list</h4>
                                    <ul className="list-group list-group-borderless">
                                        <li className="list-group-item px-0">
                                            <div className="form-check ">
                                                <input id="_dm-todoList1" className="form-check-input" type="checkbox" checked="" />
                                                <label htmlFor="_dm-todoList1" className="form-check-label text-decoration-line-through">
                                                    Find an idea <span className="badge bg-danger text-decoration-line-through">Important</span>
                                                </label>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="form-check">
                                                <input id="_dm-todoList2" className="form-check-input" type="checkbox" />
                                                <label htmlFor="_dm-todoList2" className="form-check-label">
                                                    Do some work
                                                </label>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="form-check">
                                                <input id="_dm-todoList3" className="form-check-input" type="checkbox" />
                                                <label htmlFor="_dm-todoList3" className="form-check-label">
                                                    Read the book
                                                </label>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="form-check">
                                                <input id="_dm-todoList4" className="form-check-input" type="checkbox" />
                                                <label htmlFor="_dm-todoList4" className="form-check-label">
                                                    Upgrade server <span className="badge bg-warning">Warning</span>
                                                </label>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-0">
                                            <div className="form-check">
                                                <input id="_dm-todoList5" className="form-check-input" type="checkbox" />
                                                <label htmlFor="_dm-todoList5" className="form-check-label">
                                                    Redesign my logo <span className="badge bg-info">2 Mins</span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="input-group mt-3">
                                        <input type="text" className="form-control form-control-sm" placeholder="Add new list" aria-label="Add new list" aria-describedby="button-addon" />
                                        <button id="button-addon" className="btn btn-sm btn-secondary hstack gap-2" type="button">
                                            <i className="demo-psi-add text-dark text-opacity-40 fs-4"></i>
                                            <span className="vr"></span>
                                            Add New
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h4 className="mb-3">Services</h4>
                                    <div className="list-group list-group-borderless">
                                        <div className="list-group-item px-0 mb-2">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-check-label h5 mb-0" htmlFor="_dm-dbPersonalStatus">Show my personal status</label>
                                                <div className="form-check form-switch">
                                                    <input id="_dm-dbPersonalStatus" className="form-check-input" type="checkbox" checked="" />
                                                </div>
                                            </div>
                                            <span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</span>
                                        </div>

                                        <div className="list-group-item px-0 mb-2">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-check-label h5 mb-0" htmlFor="_dm-dbOfflineContact">Show offline contact</label>
                                                <div className="form-check form-switch">
                                                    <input id="_dm-dbOfflineContact" className="form-check-input" type="checkbox" />
                                                </div>
                                            </div>
                                            <span>Aenean commodo ligula eget dolor. Aenean massa.</span>
                                        </div>

                                        <div className="list-group-item px-0 mb-2">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-check-label h5 mb-0" htmlFor="_dm-dbMuteNotifications">Mute notifications</label>
                                                <div className="form-check form-switch">
                                                    <input id="_dm-dbMuteNotifications" className="form-check-input" type="checkbox" />
                                                </div>
                                            </div>
                                            <span>Aenean commodo ligula eget dolor. Aenean massa.</span>
                                        </div>

                                        <div className="list-group-item px-0 mb-2">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-check-label h5 mb-0" htmlFor="_dm-dbInvisibleMode">Invisible Mode</label>
                                                <div className="form-check form-switch">
                                                    <input id="_dm-dbInvisibleMode" className="form-check-input" type="checkbox" checked="" />
                                                </div>
                                            </div>
                                            <span>Nascetur ridiculus mus.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center position-relative hv-grow-parent hv-outline-parent">
                                        <div className="flex-shrink-0">
                                            <img className="hv-gc hv-oc img-lg rounded-circle" src="assets/img/profile-photos/8.png" alt="Profile Picture" loading="lazy" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <a href="#" className="d-block stretched-link h5 link-offset-2-hover text-decoration-none link-underline-hover mb-0">Kathryn Obrien</a>
                                            Project manager
                                        </div>
                                    </div>

                                    <figure className="d-flex flex-column align-items-center justify-content-center my-4">
                                        <blockquote className="blockquote mb-0">
                                            <p className="quote">Lorem ipsum dolor sit amet, consecte tuer adipiscing elit, sed diam nonummy nibh euismod tincidunt</p>
                                        </blockquote>
                                    </figure>

                                    <div className="border-top pt-3">
                                        <a href="#" className="btn btn-icon btn-link text-indigo" aria-label="Facebook button">
                                            <i className="demo-psi-facebook fs-4"></i>
                                        </a>
                                        <a href="#" className="btn btn-icon btn-link text-info" aria-label="Twitter button">
                                            <i className="demo-psi-twitter fs-4"></i>
                                        </a>
                                        <a href="#" className="btn btn-icon btn-link text-red" aria-label="Google plus button">
                                            <i className="demo-psi-google-plus fs-4"></i>
                                        </a>
                                        <a href="#" className="btn btn-icon btn-link text-orange" aria-label="Instagram button">
                                            <i className="demo-psi-instagram fs-4"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content__boxed">
                    <div className="content__wrap">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-3">Order Status</h5>
                                <div className="row">
                                    <div className="col-md-6 d-flex gap-1 align-items-center mb-3">
                                        <button className="btn btn-primary hstack gap-2">
                                            <i className="demo-psi-add fs-5"></i>
                                            <span className="vr"></span>
                                            Add New
                                        </button>
                                        <button className="btn btn-icon btn-outline-light" aria-label="Print table">
                                            <i className="demo-pli-printer fs-5"></i>
                                        </button>
                                        <div className="btn-group">
                                            <button className="btn btn-icon btn-outline-light" aria-label="Information"><i className="demo-pli-exclamation fs-5"></i></button>
                                            <button className="btn btn-icon btn-outline-light" aria-label="Remove"><i className="demo-pli-recycling fs-5"></i></button>
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex gap-1 align-items-center justify-content-md-end mb-3">
                                        <div className="form-group">
                                            <input type="text" placeholder="Search..." className="form-control" autoComplete="off" />
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-icon btn-outline-light" aria-label="Download"><i className="demo-pli-download-from-cloud fs-5"></i></button>
                                            <div className="btn-group dropdown">
                                                <button className="btn btn-icons btn-outline-light dropdown-toggle hstack gap-2" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Options
                                                    <span className="vr"></span>
                                                    <span className="visually-hidden">Toggle Dropdown</span>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>
                                                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Invoice</th>
                                                <th>User</th>
                                                <th>Order date</th>
                                                <th>Amount</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-center">Tracking Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="#" className="btn-link"> Order #53431</a></td>
                                                <td>Steve N. Horton</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 22, 2024</span></td>
                                                <td>$45.00</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-success">Paid</div>
                                                </td>
                                                <td className="text-center">-</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link"> Order #53432</a></td>
                                                <td>Charles S Boyle</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 24, 2024</span></td>
                                                <td>$245.30</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-info">Shipped</div>
                                                </td>
                                                <td className="text-center">CGX0089734531</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link"> Order #53433</a></td>
                                                <td>Lucy Doe</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 24, 2024</span></td>
                                                <td>$38.00</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-info">Shipped</div>
                                                </td>
                                                <td className="text-center">CGX0089934571</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link"> Order #53434</a></td>
                                                <td>Teresa L. Doe</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 15, 2024</span></td>
                                                <td>$77.99</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-info">Shipped</div>
                                                </td>
                                                <td className="text-center">CGX0089734574</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link"> Order #53435</a></td>
                                                <td>Teresa L. Doe</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 12, 2024</span></td>
                                                <td>$18.00</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-success">Paid</div>
                                                </td>
                                                <td className="text-center">-</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link">Order #53437</a></td>
                                                <td>Charles S Boyle</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 17, 2024</span></td>
                                                <td>$658.00</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-danger">Refunded</div>
                                                </td>
                                                <td className="text-center">-</td>
                                            </tr>
                                            <tr>
                                                <td><a href="#" className="btn-link">Order #536584</a></td>
                                                <td>Scott S. Calabrese</td>
                                                <td><span className="text-body"><i className="demo-pli-clock"></i> May 19, 2024</span></td>
                                                <td>$45.58</td>
                                                <td className="text-center fs-5">
                                                    <div className="d-block badge bg-warning">Unpaid</div>
                                                </td>
                                                <td className="text-center">-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <nav className="text-align-center mt-5" aria-label="Table navigation">
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#">Previous</a>
                                        </li>
                                        <li className="page-item active" aria-current="page">
                                            <span className="page-link">1</span>
                                        </li>
                                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                                        <li className="page-item disabled"><a className="page-link" href="#">...</a></li>
                                        <li className="page-item"><a className="page-link" href="#">5</a></li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="col py-3">
                        Content area...
                    </div>
                </div>

            </section>
        </div>
    );
>>>>>>> e23dab058d89a0dc4cf281c78b209e4d411ac434
}

export default Dashboard