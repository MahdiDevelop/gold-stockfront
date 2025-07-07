import React from 'react'

export default function side() {
  return (   <div class="content px-3 py -2">
      <div class="container-fluid">
        <div class="mb-3">
          <h4>Clinic Dashboard</h4>
          <div class="row">
            <div class="col-12 col-md-6 d-flex">
              <div class="card flex-fill border-0 illustration">
                <div class="card-body p-0 d-flex flex-fill">
                  <div class="row g-0 w-100">
                    <div class="col-6">
                      <div class="p-3 m-1">
                        <h4>Wellcome To Dashboard</h4>
                        <div class="row">
                          <p class="mb-0 col">Total Threatment :</p>
                          <p class="col">3000</p>
                        </div>
                        <div class="row">
                          <p class="mb-0 col p-">Total In Threatment :</p>
                          <p class="col">3000</p>
                        </div>
                        <div class="row">
                          <p class="mb-0 col">Total :</p>
                          <p class="col">3000</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 align-self-end text-start">
                      <img
                        src="./ICONS/teath.jpg"
                        class="img-fluid illustration-img banner"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 d-flex">
              <div class="card flex-fill border-0">
                <div class="card-body py-4">
                  <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                      <div class="container">
                        <div class="row">
                          <div class="col">
                            <canvas
                              id="chart1"
                              class="h-100 w-75 p-0 m-2"
                            ></canvas>
                          </div>
                          <div class="col">
                            <canvas
                              id="chart2"
                              class="h-100 w-75 p-0 m-2"
                            ></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              {/* <!-- Table Element --> */}
              <div class="m-2  card border-0 col">
                <div class="card-header">
                  <h5 class="card-title p-3">In Threatment Table</h5>
                  {/* <div class="card-subtitle text-muted">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptatibus quod ipsum itaque qui eveniet unde dolorem aut
                    eos necessitatibus, velit vel. Dignissimos itaque dolorum
                    distinctio consequuntur doloribus nesciunt est qui.
                  </div> */}
                  <div class="card-body">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Barcode</th>
                          <th scope="col">Name</th>
                          <th scope="col">Enroll Date</th>
                          <th scope="col">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td colspan="2">Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <!-- Table Element --> */}
              <div class="m-2 card border-0 col">
                <div class="card-header">
                  <h5 class="card-title p-3">Threatment Table</h5>
                  <div class="card-subtitle text-muted"></div>
                  <div class="card-body">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Barcode</th>
                          <th scope="col">Name</th>
                          <th scope="col">Enroll Date</th>
                          <th scope="col">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td colspan="2">Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#" class="theme-toggle"></a>
          <footer class="footer footerside">
            <div class="container-fluid">
              <div class="row text-muted">
                <div class="col-6 text-start">
                  <p class="mb-0">
                    <a href="#" class="text-muted">
                      <strong>CodezSwod</strong>
                    </a>
                  </p>
                </div>
                <div class="col-6 text-end">
                  <ul class="list-inline">
                    <li class="list-inline-item">
                      <a href="#" class="text-muted">
                        Contact
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a href="#" class="text-muted">
                        About Us
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a href="#" class="text-muted">
                        Terms
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a href="#" class="text-muted">
                        Booking
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>

  )
}
