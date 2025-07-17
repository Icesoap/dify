import torch

import student

if __name__ == '__main__':
    print(torch.cuda.is_available())

    student.fun_test()
