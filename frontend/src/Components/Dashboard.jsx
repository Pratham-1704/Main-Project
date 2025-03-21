import React from 'react';

function Dashboard() {
    return (
        <div>
            <section id="content" className="content">
                <div className="content__header content__boxed overlapping">
                    <div className="content__wrap">
                        <h1 className="page-title mb-2">Dashboard</h1>
                        <h2 className="h5">Welcome back to the Dashboard.</h2>
                    </div>
                </div>

                <div className="content__boxed">
                    <div className="content__wrap">
                       
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
                </div>
            </section>
        </div>
    );
}

export default Dashboard;